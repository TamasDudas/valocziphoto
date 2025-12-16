<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ImageController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('Home', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

// Publikus kategória route-ok (bárki láthatja)
Route::get('categories', [CategoryController::class, 'index'])->name('categories.index');
Route::get('categories/{category}', [CategoryController::class, 'show'])->name('categories.show');

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
    Route::get('categories/create', [CategoryController::class, 'create'])->name('categories.create');
    Route::post('categories', [CategoryController::class, 'store'])->name('categories.store');
    Route::get('categories/{category}/edit', [CategoryController::class, 'edit'])->name('categories.edit');
    Route::patch('categories/{category}', [CategoryController::class, 'update'])->name('categories.update');
    Route::delete('categories/{category}', [CategoryController::class, 'destroy'])->name('categories.destroy');

    // Category képkezelés (csak bejelentkezett userek)
    Route::post('categories/{category}/attach-images', [CategoryController::class, 'attachImages'])->name('categories.attach-images');
    Route::post('categories/{category}/detach-image', [CategoryController::class, 'detachImage'])->name('categories.detach-image');
});

require __DIR__.'/settings.php';
