# Összegzett migrációs fájlok

A kérésed alapján egyesítettem a migrációs fájlokat táblánként egy-egy nagy migrációs fájlba, amely a végső tábla struktúrát hozza létre. Ezeket a következő projektedben használhatod alapként. Minden egyesített migráció tartalmazza az összes releváns változást (létrehozás, hozzáadás, eltávolítás), és a `down()` method visszaállítja az eredeti állapotot.

## 1. Categories tábla (egyesített: create + add user_id + drop order + add featured_image + add meta fields)

Ez a tábla kezdetben `id`, `name`, `slug`, `description`, `order`, `timestamps` mezőkkel készült. Később hozzáadták a `user_id` foreign key-t, majd eldobták az `order` mezőt. Ezután hozzáadták a `featured_image_id` mezőt (nullable foreign key az images táblához), és végül a `meta_title` és `meta_description` mezőket. Az egyesített verzió a végső struktúrát hozza létre.

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug');
            $table->text('description');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('featured_image_id')->nullable()->constrained('images')->onDelete('set null');
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
```

## 2. Images tábla (egyesített: create + add path + make versions nullable)

Ez a tábla egyetlen create migrációval készült, majd később hozzáadták a `path` mezőt, és a `versions` mezőt nullable-ra változtatták.

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('filename');
            $table->string('path')->nullable();
            $table->string('original_filename');
            $table->json('versions')->nullable();
            $table->bigInteger('size');
            $table->string('mime_type');
            $table->integer('width');
            $table->integer('height');
            $table->string('alt_text')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('images');
    }
};
```

## 3. Category-Image pivot tábla (egyesített: csak egy create migráció volt)

Ez a many-to-many kapcsolat táblája, egyetlen migrációval készült.

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('category_image', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->foreignId('image_id')->constrained()->onDelete('cascade');
            $table->timestamps();

            $table->unique(['category_id', 'image_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('category_image');
    }
};
```

## 4. Media tábla (eldobva, nem használták)

Ez a tábla kezdetben létre lett hozva, valószínűleg a Spatie Laravel Media Library csomaghoz, de később el lett dobva, mivel nem használták a projektben. Így nem része a végleges adatbázis sémának.

```php
// A media tábla el lett dobva, így nincs szükség migrációra.
```

## 5. Contacts tábla (egyesített: csak egy create migráció volt)

Ez a tábla egyetlen migrációval készült, és a kapcsolatfelvételi űrlap adatait tárolja.

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('contacts', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->string('subject')->nullable();
            $table->text('message');
            $table->boolean('is_read')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contacts');
    }
};
```

Ezeket a fájlokat másold át a következő projekted `database/migrations/` mappájába, és futtasd `php artisan migrate`-ot. Ha módosítani kell őket, vedd figyelembe a Laravel verziót és a függőségeket.
