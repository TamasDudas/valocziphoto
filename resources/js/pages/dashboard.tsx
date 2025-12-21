import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: dashboard().url,
  },
];

export default function Dashboard() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <Link
          href="/images/create"
          className="flex h-50 items-center justify-center rounded-lg border bg-popover p-6 shadow-sm transition-shadow hover:bg-input hover:shadow-md"
        >
          <h2 className="text-xl font-semibold">Kép feltöltése</h2>
        </Link>
        <Link
          href="/categories/create"
          className="flex h-50 items-center justify-center rounded-lg border bg-popover p-6 shadow-sm transition-shadow hover:bg-input hover:shadow-md"
        >
          <h2 className="text-xl font-semibold">Kategória létrehozása</h2>
        </Link>
        <Link
          href="/images"
          className="flex h-50 items-center justify-center rounded-lg border bg-popover p-6 shadow-sm transition-shadow hover:bg-input hover:shadow-md"
        >
          <h2 className="text-xl font-semibold">Galéria</h2>
        </Link>
        <Link
          href="/categories"
          className="flex h-50 items-center justify-center rounded-lg border bg-popover p-6 shadow-sm transition-shadow hover:bg-input hover:shadow-md"
        >
          <h2 className="text-xl font-semibold">
            Meglévő Kategórák kezelelése
          </h2>
        </Link>
      </div>
    </AppLayout>
  );
}
