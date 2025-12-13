import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';

interface Image {
    id: number;
    filename: string;
    original_filename: string;
    alt_text?: string;
    image_url: string;
}

interface Category {
    id: number;
    name: string;
    slug: string;
    description: string;
    featured_image_id?: number;
    featured_image?: Image;
    images: Image[];
}

export default function CategoryGallery() {
    const { category } = usePage<{ category: Category }>().props;

    // Szűrjük ki a kiemelt képet a többi közül
    const otherImages =
        category?.images?.filter(
            (img) => img.id !== category.featured_image_id,
        ) || [];

    return (
        <AppLayout>
            <Head title={category?.name || 'Kategória'} />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6">
                            {/* Kategória fejléc */}
                            <div className="mb-8">
                                <h1 className="mb-2 text-3xl font-bold">
                                    {category?.name || 'Kategória név hiányzik'}
                                </h1>
                                {category?.description && (
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {category.description}
                                    </p>
                                )}
                            </div>

                            {/* Kiemelt kép */}
                            {category.featured_image && (
                                <div className="mb-8">
                                    <h2 className="mb-4 text-xl font-semibold">
                                        Kiemelt kép
                                    </h2>
                                    <div className="overflow-hidden rounded-lg shadow-lg">
                                        <img
                                            src={
                                                category.featured_image
                                                    .image_url
                                            }
                                            alt={
                                                category.featured_image
                                                    .alt_text ||
                                                category.featured_image
                                                    .original_filename
                                            }
                                            className="h-96 w-full object-cover"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Galéria */}
                            {otherImages.length > 0 && (
                                <div>
                                    <h2 className="mb-4 text-xl font-semibold">
                                        Galéria ({otherImages.length} kép)
                                    </h2>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
                                        {otherImages.map((image) => (
                                            <div
                                                key={image.id}
                                                className="overflow-hidden rounded bg-gray-100 dark:bg-gray-700"
                                            >
                                                <img
                                                    src={image.image_url}
                                                    alt={
                                                        image.alt_text ||
                                                        image.original_filename
                                                    }
                                                    className="h-48 w-full object-cover transition-transform hover:scale-105"
                                                />
                                                <div className="p-2">
                                                    <p className="truncate text-xs text-gray-600 dark:text-gray-400">
                                                        {
                                                            image.original_filename
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Üres állapot */}
                            {!category.featured_image &&
                                otherImages.length === 0 && (
                                    <div className="py-12 text-center">
                                        <p className="text-gray-500">
                                            Ehhez a kategóriához még nincsenek
                                            képek hozzárendelve.
                                        </p>
                                    </div>
                                )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
