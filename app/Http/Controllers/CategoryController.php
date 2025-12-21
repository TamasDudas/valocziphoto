<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Image;
use App\Models\Category;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Resources\ImageResource;
use App\Http\Resources\CategoryResource;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Minden kategória látható (publikus lista)
        $categories = Category::withCount('images')
            ->with('featuredImage')
            ->get();

        return Inertia::render('Home', ['categories' => CategoryResource::collection($categories)]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('CreateCategory');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'slug' => 'sometimes|string|max:255|unique:categories,slug',
                'description' => 'nullable|string',
                'meta_title' => 'nullable|string|max:60',
                'meta_description' => 'nullable|string|max:160',
            ]);

            $validated['user_id'] = auth()->id();
            $validated['slug'] = $validated['slug'] ?? Str::slug($validated['name']);

            Category::create($validated);

            return redirect()->back()->with('success', 'Kategória sikeresen létrehozva!');
        } catch (\Exception $e) {
        
            return redirect()->back()
                ->withErrors(['error' => 'Váratlan hiba történt: '.$e->getMessage()])
                ->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category)
    {
        // Publikus kategória megtekintés - bárki láthatja
        $category->load(['images', 'featuredImage']);

        return Inertia::render('Category', ['category' => (new CategoryResource($category))->resolve()]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Category $category)
    {
        // Ellenőrizzük hogy a felhasználó tulajdonosa-e a kategóriának
        if ($category->user_id !== auth()->id()) {
            abort(403, 'Nem szerkesztheted mások kategóriáit.');
        }

        $category->load(['images', 'featuredImage']);

        return Inertia::render('EditCategory', [
            'category' => (new CategoryResource($category))->resolve(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Category $category)
    {
        // Ellenőrizzük hogy a felhasználó tulajdonosa-e a kategóriának
        if ($category->user_id !== auth()->id()) {
            abort(403, 'Nem frissítheted mások kategóriáit.');
        }

        try {
            $validated = $request->validate([
                'name' => 'sometimes|required|string|max:255',
                'slug' => 'sometimes|string|max:255|unique:categories,slug,'.$category->id,
                'description' => 'nullable|string',
                'featured_image_id' => 'nullable|exists:images,id',
                'meta_title' => 'nullable|string|max:60',
                'meta_description' => 'nullable|string|max:160',
            ]);

            // Ha új név érkezik de nincs slug, generáljuk a slug-ot a névből
            if (isset($validated['name']) && !isset($validated['slug'])) {
                $validated['slug'] = Str::slug($validated['name']);
            }

            $category->update($validated);

            return redirect()->back()->with('success', 'Kategória sikeresen frissítve!');
        } catch (\Exception $e) {
            Log::error('Hiba a kategória frissítésekor', ['error' => $e->getMessage()]);

            return redirect()->back()
                ->withErrors(['error' => 'Váratlan hiba történt: '.$e->getMessage()])
                ->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        // Ellenőrizzük hogy a felhasználó tulajdonosa-e a kategóriának
        if ($category->user_id !== auth()->id()) {
            abort(403, 'Nem törölheted mások kategóriáit.');
        }

        try {
            $category->delete();

            return redirect()->back()->with('success', 'A kategória sikeresen törölve!');
        } catch (\Exception $e) {
            Log::error('Hiba a kategória törlésekor', ['error' => $e->getMessage()]);

            return redirect()->back()->withErrors(['error' => 'Hiba történt a törlés során.']);
        }

    }

    /**
     * Attach multiple images to a category.
     */
    public function attachImages(Request $request, Category $category)
    {
        // Ellenőrizzük hogy a felhasználó tulajdonosa-e a kategóriának
        if ($category->user_id !== auth()->id()) {
            abort(403, 'Nem adhatsz képeket mások kategóriáihoz.');
        }

        try {
            $validated = $request->validate([
                'image_ids' => 'required|array',
                'image_ids.*' => 'exists:images,id',
            ]);

            // syncWithoutDetaching() hozzáadja az új képeket duplikáció nélkül
            // Meglévő kapcsolatokat megtartja, csak az új képeket adja hozzá
            $category->images()->syncWithoutDetaching($validated['image_ids']);

            return redirect()->back()->with('success', 'Képek sikeresen hozzáadva a kategóriához!');
        } catch (\Exception $e) {
            Log::error('Hiba a képek hozzáadásakor', ['error' => $e->getMessage()]);

            return redirect()->back()
                ->withErrors(['error' => 'Váratlan hiba történt: '.$e->getMessage()]);
        }
    }

    /**
     * Detach an image from a category.
     */
    public function detachImage(Request $request, Category $category)
    {
        // Ellenőrizzük hogy a felhasználó tulajdonosa-e a kategóriának
        if ($category->user_id !== auth()->id()) {
            abort(403, 'Nem távolíthatsz el képeket mások kategóriáiból.');
        }

        try {
            $validated = $request->validate([
                'image_id' => 'required|exists:images,id',
            ]);

            // detach() eltávolítja a kapcsolatot a pivot táblából
            // A kép a galériában megmarad, csak a kategóriából lesz eltávolítva
            $category->images()->detach($validated['image_id']);

            return redirect()->back()->with('success', 'Kép sikeresen eltávolítva a kategóriából!');
        } catch (\Exception $e) {
            Log::error('Hiba a kép eltávolításakor', ['error' => $e->getMessage()]);

            return redirect()->back()
                ->withErrors(['error' => 'Váratlan hiba történt: '.$e->getMessage()]);
        }
    }
}
