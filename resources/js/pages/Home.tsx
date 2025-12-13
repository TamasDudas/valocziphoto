import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function Home({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    return (
        <AppLayout>
            <Head title="Home" />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold">
                    Üdvözöljük a Valoczi Photo galériában!
                </h1>
                <p className="mt-4">Fedezze fel képeinket és kategóriáinkat.</p>
            </div>
        </AppLayout>
    );
}
