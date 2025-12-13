<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Image;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use App\Http\Resources\ImageResource;

class ImageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $images = Image::with('categories')->where('user_id', auth()->id())->get();

        return Inertia::render('Gallery', ['images' => ImageResource::collection($images)]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('CreateGalleryImage');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg,webp,avif|max:2048',
                'alt_text' => 'nullable|string|max:255',
                'category_ids' => 'array',
                'category_ids.*' => 'exists:categories,id',
            ]);

            $imageFile = $request->file('image');

            // Létrehozzuk az Image rekordot alapadatokkal
            $image = Image::create([
                'user_id' => auth()->id(),
                'filename' => $imageFile->getClientOriginalName(),
                'original_filename' => $imageFile->getClientOriginalName(),
                'size' => $imageFile->getSize(),
                'mime_type' => $imageFile->getMimeType(),
                'width' => getimagesize($imageFile)[0] ?? null,
                'height' => getimagesize($imageFile)[1] ?? null,
                'alt_text' => $validated['alt_text'] ?? null,
                'versions' => json_encode(['thumbnail', 'medium', 'large']),
            ]);

            // Spatie MediaLibrary hozzáadása
            $image->addMediaFromRequest('image')
                  ->toMediaCollection();

            if (isset($validated['category_ids'])) {
                $image->categories()->sync($validated['category_ids']);
            }

            return redirect()->back()->with('success', 'Kép sikeresen feltöltve!');
        } catch (\Exception $e) {
            Log::error('Hiba a kép feltöltésekor', ['error' => $e->getMessage()]);
            return redirect()->back()
                             ->withErrors(['error' => 'Váratlan hiba történt: ' . $e->getMessage()])
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
                             ->withErrors(['error' => 'Váratlan hiba történt: ' . $e->getMessage()])
                             ->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Image $image)
    {
        $this->authorize('delete', $image);

        try {
            $image->delete();

            return redirect()->back()->with('success', 'A kép sikeresen törölve!');
        } catch (\Exception $e) {
            Log::error('Hiba a kép törlésekor', ['error' => $e->getMessage()]);
            return redirect()->back()->withErrors(['error' => 'Hiba történt a törlés során.']);
        }
    }
}
