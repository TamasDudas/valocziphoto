import UploadeImageForm from '@/components/forms/UploadeImageForm';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

interface Category {
    id: number;
    name: string;
}

interface Props {
    categories: Category[];
}

export default function CreateGalleryImage({ categories }: Props) {
    return (
        <div>
            <Head title="Kép feltöltés" />
            <AppLayout>
                <UploadeImageForm categories={categories} />
            </AppLayout>
        </div>
    );
}
