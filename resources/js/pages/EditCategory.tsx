import CategoryForm from '@/components/forms/CategoryForm';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

interface Image {
  id: number;
  image_url: string;
  original_filename: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  meta_title?: string;
  meta_description?: string;
  featured_image?: Image;
}

interface Props {
  category: Category;
  availableImages: Image[];
}

export default function EditCategory({ category, availableImages }: Props) {
  return (
    <AppLayout>
      <Head title={`${category.name} szerkesztése`} />
      <CategoryForm category={category} />
    </AppLayout>
  );
}
