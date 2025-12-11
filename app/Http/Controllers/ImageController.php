<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Image;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Resources\ImageResource;

class ImageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Szűrés a bejelentkezett felhasználó képeire
        $images = Image::with('categories')->where('user_id', auth()->id())->get();

        return Inertia::render('Images', ImageResource::collection($images));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'image' => 'required|image|mimes:jpeg,png,jpg,gif,avif|max:2048',
                'alt_text' => 'nullable|string|max:255',
                'category_ids' => 'sometimes|array',
                'category_ids.*' => 'exists:categories,id',
            ]);

            // Kép létrehozása alap adatokkal,mert még nem ismerjük a fájl meta adatait
            $image = Image::create([
                'user_id' => auth()->id(),
                'alt_text' => $validated['alt_text'] ?? null,
            ]);

            // Fájl hozzáadása medialibrary-vel
            $media = $image->addMediaFromRequest('image')
                ->toMediaCollection('images');

            // Kép adatok kinyerése (width, height), mert a Media objektum nem tartalmazza ezeket
            $imageInfo = getimagesize($request->file('image')->getRealPath());

            // Meta adatok frissítése, mert itt már ismerjük a meta adatokat
            $image->update([
                'filename' => $media->file_name,
                'original_filename' => $media->name,
                'size' => $media->size,
                'mime_type' => $media->mime_type,
                'width' => $imageInfo[0] ?? 0,
                'height' => $imageInfo[1] ?? 0,
                'versions' => [], // Medialibrary kezeli
            ]);

            // Kategóriák hozzárendelése, ha vannak
            if ($request->has('category_ids')) {
                $image->categories()->attach($request->category_ids);
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
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Image $image)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Image $image)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Image $image)
    {
        //
    }
}
