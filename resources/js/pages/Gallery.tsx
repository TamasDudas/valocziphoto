import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { create } from '@/routes/images';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

interface Image {
    id: number;
    filename: string;
    original_filename: string;
    alt_text?: string;
    categories: { id: number; name: string }[];
    image_url: string;
}

interface Category {
    id: number;
    name: string;
    slug: string;
}

export default function Gallery() {
    const { images, categories } = usePage().props as {
        images?: Image[];
        categories?: Category[];
    };
    const imageList = Array.isArray(images) ? images : [];
    const categoryList = Array.isArray(categories) ? categories : [];
    const [selectedImage, setSelectedImage] = useState<Image | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImages, setSelectedImages] = useState<number[]>([]);

    //Kiemelt kép kezelése
    const handleSetFeaturedImage = (categoryId: number) => {
        if (!selectedImage) return;

        router.patch(
            `/categories/${categoryId}`,
            {
                featured_image_id: selectedImage.id,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsModalOpen(false);
                    setSelectedImage(null);
                },
            },
        );
    };

    // Checkbox kezelés
    const toggleImageSelection = (imageId: number) => {
        setSelectedImages((prev) =>
            prev.includes(imageId)
                ? prev.filter((id) => id !== imageId)
                : [...prev, imageId],
        );
    };

    // Több kép hozzáadása kategóriához
    const handleAttachToCategory = (categoryId: number) => {
        if (selectedImages.length === 0) return;

        router.post(
            `/categories/${categoryId}/attach-images`,
            {
                image_ids: selectedImages,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setSelectedImages([]);
                },
            },
        );
    };

    return (
        <AppLayout>
            <Head title="Galéria" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                        {/* Képek grid */}
                        <div className="lg:col-span-3">
                            <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                                <div className="p-6">
                                    <div className="mb-6 flex items-center justify-between">
                                        <h2 className="text-2xl font-bold">
                                            Galéria
                                        </h2>
                                        <Link
                                            href={create().url}
                                            className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                                        >
                                            Új kép feltöltése
                                        </Link>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                        {imageList.map((image) => (
                                            <div
                                                key={image.id}
                                                className="relative rounded bg-gray-100 p-4 dark:bg-gray-700"
                                            >
                                                <div className="absolute top-2 right-2">
                                                    <Checkbox
                                                        checked={selectedImages.includes(
                                                            image.id,
                                                        )}
                                                        onCheckedChange={() =>
                                                            toggleImageSelection(
                                                                image.id,
                                                            )
                                                        }
                                                        className="bg-white"
                                                    />
                                                </div>
                                                <img
                                                    src={image.image_url}
                                                    alt={
                                                        image.alt_text ||
                                                        image.original_filename
                                                    }
                                                    className="h-48 w-full rounded object-cover"
                                                />
                                                <h3 className="mt-2 text-sm font-medium">
                                                    {image.original_filename}
                                                </h3>
                                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                                    Kategóriák:{' '}
                                                    {image.categories
                                                        .map((c) => c.name)
                                                        .join(', ') || 'Nincs'}
                                                </p>
                                                <button
                                                    onClick={() => {
                                                        setSelectedImage(image);
                                                        setIsModalOpen(true);
                                                    }}
                                                    className="mt-2 w-full rounded bg-green-500 px-3 py-1 text-sm text-white hover:bg-green-600"
                                                >
                                                    Beállítás kiemelt képnek
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    {imageList.length === 0 && (
                                        <p className="text-center text-gray-500">
                                            Még nincs kép feltöltve.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Kategóriák panel - alapból látható */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-6 overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                                <div className="p-6">
                                    <h3 className="mb-4 text-lg font-semibold">
                                        Kategóriák
                                    </h3>
                                    {selectedImages.length > 0 ? (
                                        <>
                                            <p className="mb-4 text-sm text-muted-foreground">
                                                {selectedImages.length} kép
                                                kiválasztva. Válaszd ki a
                                                kategóriát:
                                            </p>
                                            <div className="space-y-2">
                                                {categoryList.map(
                                                    (category) => (
                                                        <Button
                                                            key={category.id}
                                                            onClick={() =>
                                                                handleAttachToCategory(
                                                                    category.id,
                                                                )
                                                            }
                                                            className="w-full justify-start"
                                                            variant="outline"
                                                        >
                                                            {category.name}
                                                        </Button>
                                                    ),
                                                )}
                                            </div>
                                            {categoryList.length === 0 && (
                                                <p className="text-sm text-muted-foreground">
                                                    Nincs kategória. Először
                                                    hozz létre egyet!
                                                </p>
                                            )}
                                        </>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">
                                            Válassz ki képeket a kategóriához
                                            való hozzáadáshoz.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dialog a kategória kiválasztásához */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Válassz kategóriát</DialogTitle>
                        <DialogDescription>
                            Válaszd ki, melyik kategória kiemelt képe legyen ez
                            a kép.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedImage && (
                        <div className="mb-4">
                            <img
                                src={selectedImage.image_url}
                                alt={selectedImage.original_filename}
                                className="h-32 w-full rounded object-cover"
                            />
                            <p className="mt-2 text-sm text-muted-foreground">
                                {selectedImage.original_filename}
                            </p>
                        </div>
                    )}
                    <div className="space-y-2">
                        {categoryList.map((category) => (
                            <Button
                                key={category.id}
                                onClick={() =>
                                    handleSetFeaturedImage(category.id)
                                }
                                className="w-full justify-start"
                                variant="outline"
                            >
                                {category.name}
                            </Button>
                        ))}
                    </div>
                    {categoryList.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                            Nincs kategória. Először hozz létre egyet!
                        </p>
                    )}
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
