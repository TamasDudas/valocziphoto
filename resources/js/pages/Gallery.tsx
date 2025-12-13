import AppLayout from '@/layouts/app-layout';
import { create } from '@/routes/images';
import { Head, Link, usePage } from '@inertiajs/react';

interface Image {
    id: number;
    filename: string;
    original_filename: string;
    alt_text?: string;
    categories: { id: number; name: string }[];
    image_url: string;
}

export default function Gallery() {
    const { images } = usePage().props as { images?: Image[] };
    const imageList = Array.isArray(images) ? images : [];
    return (
        <AppLayout>
            <Head title="Galéria" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6">
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-2xl font-bold">Galéria</h2>
                                <Link
                                    href={create().url}
                                    className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                                >
                                    Új kép feltöltése
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
                                {imageList.map((image) => (
                                    <div
                                        key={image.id}
                                        className="rounded bg-gray-100 p-4 dark:bg-gray-700"
                                    >
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
            </div>
        </AppLayout>
    );
}
