import CategoryForm from '@/components/forms/CategoryForm';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function CreateCategory() {
    return (
        <div>
            <Head title="Kategória létrehozása" />
            <AppLayout>
                <CategoryForm />
            </AppLayout>
        </div>
    );
}
