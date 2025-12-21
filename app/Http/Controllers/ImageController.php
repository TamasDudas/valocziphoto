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
        // paginate(20) - 20 kép lesz oldalanként
        // Automatikusan kezeli a ?page=2, ?page=3 stb. URL paramétereket
        // Visszaad egy LengthAwarePaginator objektumot, ami tartalmazza:
        // - data: a képek az adott oldalon
        // - current_page, last_page, per_page, total stb. meta adatok
        $images = Image::with('categories')
            ->where('user_id', auth()->id())
            ->latest() // legújabb először (created_at desc)
            ->paginate(10);
        
        $categories = Category::where('user_id', auth()->id())->get();

        return Inertia::render('Gallery', [
            // Pagination meta adatok megtartása: manuálisan strukturáljuk
  
            'images' => [
                'data' => ImageResource::collection($images->items())->resolve(),
                //Képek az aktuális oldalon
                'current_page' => $images->currentPage(),
                'last_page' => $images->lastPage(),
                'per_page' => $images->perPage(),
                'total' => $images->total(),
                'links' => $images->linkCollection()->toArray(),
            //   links: [                          // Pagination gombok
            //     {url: null, label: "&laquo; Previous", active: false},
            //     {url: "/gallery?page=1", label: "1", active: true},
            //     {url: "/gallery?page=2", label: "2", active: false},
            //     ...
            //   ]
            // }
            ],
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
                'images.*' => ['image', 'max:1500'],
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

                // Kép dimenziók lekérése (csak egyszer hívjuk meg)
                $imageSize = getimagesize($imageFile);

                // Adatbázis rekord létrehozása az images táblában
                // Tároljuk a kép metaadatait: méret, mime type, dimenziók, stb.
                $image = Image::create([
                    'user_id' => auth()->id(),
                    'filename' => $uniqueFilename,
                    'original_filename' => $imageFile->getClientOriginalName(),
                    'size' => $imageFile->getSize(),
                    'mime_type' => $imageFile->getMimeType(),
                    'width' => $imageSize[0] ?? null,
                    'height' => $imageSize[1] ?? null,
                    'alt_text' => $altText,
                    'path' => $path,
                ]);

                // sync() a many-to-many kapcsolathoz: frissíti a pivot táblát (category_image)
                // - Törli azokat a kapcsolatokat, amik NINCSENEK a megadott tömbben
                // - Hozzáadja azokat, amik nincsenek még bent de a tömbben vannak
                // - Megtartja azokat, amik már bent vannak és a tömbben is
                // Üres tömbbel ([]) törli az összes kapcsolatot
                $image->categories()->sync($validated['category_ids'] ?? []);
            }

            return redirect()->route('images.index')->with('success', 'Kép sikeresen feltöltve!');
        } catch (\Exception $e) {
            

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

            // sync() szinkronizálja a kategória kapcsolatokat a pivot táblában
            // Ha nincs category_ids a requestben, üres tömb megy és minden kapcsolat törlődik
            $image->categories()->sync($validated['category_ids'] ?? []);

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

            return redirect()->back()->with('success', 'A kép sikeresen törölve!');
        } catch (\Exception $e) {
            Log::error('Hiba a kép törlésekor', ['error' => $e->getMessage()]);

            return redirect()->back()->withErrors(['error' => 'Hiba történt a törlés során.']);
        }
    }

}
