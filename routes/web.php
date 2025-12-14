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

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('images', ImageController::class);
    Route::post('images/cleanup', [ImageController::class, 'cleanup'])->name('images.cleanup');
    Route::resource('categories', CategoryController::class)->except('index');
    Route::post('categories/{category}/attach-images', [CategoryController::class, 'attachImages'])->name('categories.attach-images');
    Route::post('categories/{category}/detach-image', [CategoryController::class, 'detachImage'])->name('categories.detach-image');
});

Route::get('categories', [CategoryController::class, 'index'])->name('categories.index');

require __DIR__.'/settings.php';
