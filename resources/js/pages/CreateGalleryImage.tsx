import UploadeImageForm from '@/components/forms/UploadeImageForm';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function CreateGalleryImage() {
    return (
        <div>
            <Head title="Kép feltöltés" />
            <AppLayout>
                <UploadeImageForm />
            </AppLayout>
        </div>
    );
}
