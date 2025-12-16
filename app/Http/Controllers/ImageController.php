<?php

namespace App\Http\Controllers;

use App\Http\Resources\ImageResource;
use App\Models\Category;
use App\Models\Image;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ImageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $images = Image::with('categories')->where('user_id', auth()->id())->get();
        
        // resolve() azonnal PHP tömbbé konvertálja a Resource Collection-t.
        // Nélküle ResourceCollection objektumot kapnánk, ami később problémát okozhat
        // az Inertia props feldolgozásakor. A resolve() biztosítja hogy tiszta
        // PHP array megy át a frontend-nek JSON-ként.
        $imagesArray = ImageResource::collection($images)->resolve();
        $categories = Category::where('user_id', auth()->id())->get();

        return Inertia::render('Gallery', [
            'images' => $imagesArray,
            'categories' => $categories,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = Category::where('user_id', auth()->id())->get();

        return Inertia::render('CreateGalleryImage', ['categories' => $categories]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'images' => 'required|array',
                'images.*' => 'image|mimes:jpeg,png,jpg,gif,svg,webp,avif|max:800',
                'alt_text' => 'nullable|string|max:255',
                'category_ids' => 'array',
                'category_ids.*' => 'exists:categories,id',
            ]);

            // A frontendről érkező File objektumok kinyerése a requestből
            // Ez egy tömb, mert multiple upload van engedélyezve
            $imageFiles = $request->file('images');
            
            // Alt text kinyerése a validált adatokból, vagy null ha nem adtak meg
            $altText = $validated['alt_text'] ?? null;

    
            // Végigmegyünk minden feltöltött képen és egyesével mentjük őket
            foreach ($imageFiles as $imageFile) {
                // Egyedi fájlnév generálása UUID-val, hogy ne legyen névütközés
                // Például: 550e8400-e29b-41d4-a716-446655440000.jpg
                $uniqueFilename = Str::uuid().'.'.$imageFile->getClientOriginalExtension();

                // Fizikai fájl mentése storage/app/public/images könyvtárba
                // A 'public' disk a config/filesystems.php-ban van definiálva
                // Az storeAs() visszaadja a relatív útvonalat: 'images/550e8400...jpg'
                $path = $imageFile->storeAs('images', $uniqueFilename, 'public');

                // Adatbázis rekord létrehozása az images táblában
                // Tároljuk a kép metaadatait: méret, mime type, dimenziók, stb.
                $image = Image::create([
                    'user_id' => auth()->id(),
                    'filename' => $uniqueFilename,
                    'original_filename' => $imageFile->getClientOriginalName(),
                    'size' => $imageFile->getSize(),
                    'mime_type' => $imageFile->getMimeType(),
                    'width' => getimagesize($imageFile)[0] ?? null,
                    'height' => getimagesize($imageFile)[1] ?? null,
                    'alt_text' => $altText,
                    'path' => $path,
                ]);

                // Ha a user kiválasztott kategóriákat, hozzárendeljük a képet a kategóriákhoz
                // sync() törli a régi kapcsolatokat és létrehozza az újakat a pivot táblában
                if (isset($validated['category_ids'])) {
                    $image->categories()->sync($validated['category_ids']);
                }
            }

            // Temp fájlok törlése sikeres feltöltés után
            $this->cleanupTempFiles();

            return redirect()->route('images.index')->with('success', 'Kép sikeresen feltöltve!');
        } catch (\Exception $e) {
            Log::error('Hiba a kép feltöltésekor', ['error' => $e->getMessage()]);

            // Temp fájlok törlése hiba esetén
            $this->cleanupTempFiles();

            return redirect()->back()
                ->withErrors(['error' => 'Váratlan hiba történt: '.$e->getMessage()])
                ->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Image $image)
    {
        $this->authorize('view', $image);

        return Inertia::render('Image', ['image' => new ImageResource($image)]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Image $image)
    {
        $this->authorize('update', $image);

        return Inertia::render('EditImage', ['image' => new ImageResource($image)]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Image $image)
    {
        $this->authorize('update', $image);

        try {
            $validated = $request->validate([
                'filename' => 'sometimes|string|max:255',
                'original_filename' => 'sometimes|string|max:255',
                'size' => 'sometimes|integer',
                'mime_type' => 'sometimes|string|max:255',
                'width' => 'sometimes|integer',
                'height' => 'sometimes|integer',
                'alt_text' => 'nullable|string|max:255',
                'category_ids' => 'array',
                'category_ids.*' => 'exists:categories,id',
            ]);

            $image->update($validated);

            if (isset($validated['category_ids'])) {
                $image->categories()->sync($validated['category_ids']);
            }

            return redirect()->back()->with('success', 'Kép sikeresen frissítve!');
        } catch (\Exception $e) {
            Log::error('Hiba a kép frissítésekor', ['error' => $e->getMessage()]);

            return redirect()->back()
                ->withErrors(['error' => 'Váratlan hiba történt: '.$e->getMessage()])
                ->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Image $image)
    {
        // Ellenőrizzük hogy a felhasználó tulajdonosa-e a képnek
        if ($image->user_id !== auth()->id()) {
            abort(403, 'Nem törölheted mások képeit.');
        }

        try {
            // Fizikai fájl törlése a storage-ból
            if ($image->path && Storage::disk('public')->exists($image->path)) {
                Storage::disk('public')->delete($image->path);
            }

            $image->delete();

            // Temp fájlok törlése kép törlés után
            $this->cleanupTempFiles();

            return redirect()->back()->with('success', 'A kép sikeresen törölve!');
        } catch (\Exception $e) {
            Log::error('Hiba a kép törlésekor', ['error' => $e->getMessage()]);

            return redirect()->back()->withErrors(['error' => 'Hiba történt a törlés során.']);
        }
    }

    /**
     * Törli az árva temp fájlokat a media-library temp könyvtárból
     */
    private function cleanupTempFiles()
    {
        $tempPath = storage_path('app/media-library/temp');

        if (is_dir($tempPath)) {
            $files = glob($tempPath . '/*');
            foreach ($files as $file) {
                if (is_dir($file)) {
                    // Rekurzívan töröljük a könyvtárat és tartalmát
                    $this->deleteDirectory($file);
                } else {
                    unlink($file);
                }
            }
        }
    }

    /**
     * Rekurzívan töröl egy könyvtárat és tartalmát
     */
    private function deleteDirectory($dir)
    {
        if (!is_dir($dir)) {
            return;
        }

        $files = array_diff(scandir($dir), ['.', '..']);
        foreach ($files as $file) {
            $path = $dir . '/' . $file;
            if (is_dir($path)) {
                $this->deleteDirectory($path);
            } else {
                unlink($path);
            }
        }

        rmdir($dir);
    }

    /**
     * Manuális temp fájl cleanup (opcionális route)
     */
    public function cleanup()
    {
        $this->cleanupTempFiles();

        return redirect()->back()->with('success', 'Temp fájlok sikeresen törölve!');
    }
}
