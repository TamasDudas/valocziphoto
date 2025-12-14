import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';

interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string;
    images_count?: number;
    featured_image?: {
        id: number;
        image_url: string;
        original_filename: string;
    };
}

interface Props {
    categories: {
        data: Category[];
    };
}

export default function Categories({ categories }: Props) {
    const categoryList = categories.data;
    return (
        <AppLayout>
            <Head title="Kategóriák" />
            <div className="container mx-auto px-4 py-8">
                <h1 className="mb-6 text-3xl font-bold">Kategóriák</h1>
                {categoryList.length === 0 ? (
                    <p className="text-gray-500">Nincsenek kategóriák.</p>
                ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {categoryList.map((category) => (
                            <Link
                                key={category.id}
                                href={`/categories/${category.id}`}
                                className="block overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg dark:bg-gray-800"
                            >
                                {category.featured_image && (
                                    <img
                                        src={category.featured_image.image_url}
                                        alt={category.name}
                                        className="h-48 w-full object-cover"
                                    />
                                )}
                                <div className="p-6">
                                    <h2 className="mb-2 text-xl font-semibold">
                                        {category.name}
                                    </h2>
                                    {category.description && (
                                        <p className="mb-4 text-gray-600 dark:text-gray-400">
                                            {category.description}
                                        </p>
                                    )}
                                    <p className="text-sm text-gray-500">
                                        Képek: {category.images_count || 0}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
