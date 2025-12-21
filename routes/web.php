<?php

use Inertia\Inertia;
use Laravel\Fortify\Features;
use Illuminate\Support\Facades\Route;
use App\Http\Resources\CategoryResource;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\SitemapController;

Route::get('/', function () {
    $categories = \App\Models\Category::withCount('images')
        ->with('featuredImage')
        ->get();

    return Inertia::render('Home', [
        'canRegister' => Features::enabled(Features::registration()),
        'categories' => CategoryResource::collection($categories),
    ]);
})->name('home');

// Kapcsolat oldal (publikus)
Route::get('kapcsolat', function () {
    return Inertia::render('Contact');
})->name('contact');

// Rólunk (publikus)
Route::get('rolunk', function () {
    return Inertia::render('AboutUs');
})->name('aboutus');


// ASZF (publikus)
Route::get('aszf', function () {
    return Inertia::render('Aszf');
})->name('aszf');

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Images (csak bejelentkezett userek)
    Route::get('images', [ImageController::class, 'index'])->name('images.index');
    Route::get('images/create', [ImageController::class, 'create'])->name('images.create');
    Route::post('images', [ImageController::class, 'store'])->name('images.store');
    Route::delete('images/{image}', [ImageController::class, 'destroy'])->name('images.destroy');

    // Categories kezelés (csak bejelentkezett userek)
    // FONTOS: create ELŐBB mint {category} különben "create" kategória ID-nek számít
    Route::get('categories/create', [CategoryController::class, 'create'])->name('categories.create');
    Route::post('categories', [CategoryController::class, 'store'])->name('categories.store');
    Route::get('categories/{category}/edit', [CategoryController::class, 'edit'])->name('categories.edit');
    Route::patch('categories/{category}', [CategoryController::class, 'update'])->name('categories.update');
    Route::delete('categories/{category}', [CategoryController::class, 'destroy'])->name('categories.destroy');
    Route::get('categories', [CategoryController::class, 'handleCategories'])->name('all.categories');

    // Category képkezelés (csak bejelentkezett userek)
    Route::post('categories/{category}/attach-images', [CategoryController::class, 'attachImages'])->name('categories.attach-images');
    Route::post('categories/{category}/detach-image', [CategoryController::class, 'detachImage'])->name('categories.detach-image');
});

// Publikus kategória megtekintés - A VÉGÉN hogy ne ütközzön a create-tel
Route::get('categories/{category}', [CategoryController::class, 'show'])->name('categories.show');

Route::post('contact', [ContactController::class, 'store'])->name('contact.store');

// Sitemap
Route::get('sitemap.xml', [SitemapController::class, 'index'])->name('sitemap');

require __DIR__.'/settings.php';
