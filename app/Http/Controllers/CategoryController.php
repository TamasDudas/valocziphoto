<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use App\Http\Resources\CategoryResource;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categories = Category::all();

        return Inertia::render('Categories', ['categories' => CategoryResource::collection($categories)]);
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
            ]);

            $validated['user_id'] = auth()->id();
            $validated['slug'] = $validated['slug'] ?? Str::slug($validated['name']);

            Category::create($validated);

            return redirect()->back()->with('success', 'Kategória sikeresen létrehozva!');
        } catch (\Exception $e) {
            Log::error('Hiba a kategória létrehozásakor', ['error' => $e->getMessage()]);
            return redirect()->back()
                             ->withErrors(['error' => 'Váratlan hiba történt: ' . $e->getMessage()])
                             ->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category)
    {
        $category->load('images');
        return Inertia::render('Category', ['category' => new CategoryResource($category)]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Category $category)
    {
        return Inertia::render('EditCategory', ['category' => new CategoryResource($category)]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Category $category)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'slug' => 'sometimes|string|max:255|unique:categories,slug,' . $category->id,
                'description' => 'nullable|string',
            ]);

            $validated['user_id'] = auth()->id();
            $validated['slug'] = $validated['slug'] ?? Str::slug($validated['name']);

            $category->update($validated);

            return redirect()->back()->with('success', 'Kategória sikeresen frissítve!');
        } catch (\Exception $e) {
            Log::error('Hiba a kategória frissítésekor', ['error' => $e->getMessage()]);
            return redirect()->back()
                             ->withErrors(['error' => 'Váratlan hiba történt: ' . $e->getMessage()])
                             ->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        try {
            $category->delete();

            return redirect()->back()->with('success', 'A kategória sikeresen törölve!');
        } catch (\Exception $e) {
            Log::error('Hiba a kategória törlésekor', ['error' => $e->getMessage()]);
            return redirect()->back()->withErrors(['error' => 'Hiba történt a törlés során.']);
        }

    }
}
