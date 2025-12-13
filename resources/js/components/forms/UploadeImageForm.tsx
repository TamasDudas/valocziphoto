import { store } from '@/actions/App/Http/Controllers/ImageController';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { router } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

interface Category {
    id: number;
    name: string;
}

interface Props {
    categories: Category[];
}

export default function UploadeImageForm({ categories }: Props) {
    const [previews, setPreviews] = useState<string[]>([]);
    const [processing, setProcessing] = useState(false);
    const [images, setImages] = useState<File[]>([]);
    const [altText, setAltText] = useState('');
    const [categoryIds, setCategoryIds] = useState<number[]>([]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);

        if (selectedFiles.length === 0) {
            return;
        }

        // Felhalmozzuk a képeket a meglévőkhöz
        setImages((prev) => [...prev, ...selectedFiles]);

        const promises = selectedFiles.map((file) => {
            return new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.readAsDataURL(file);
            });
        });

        Promise.all(promises).then((results) => {
            setPreviews((prev) => [...prev, ...results]);
        });

        // Input mező kiürítése, hogy újra lehessen választani
        e.target.value = '';
    };

    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
        setPreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const handleCategoryChange = (categoryId: number, checked: boolean) => {
        if (checked) {
            setCategoryIds([...categoryIds, categoryId]);
        } else {
            setCategoryIds(categoryIds.filter((id) => id !== categoryId));
        }
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        if (images.length === 0) {
            alert('Kérlek válassz ki legalább egy képet!');
            return;
        }

        setProcessing(true);

        const formData = new FormData();

        // Add all images
        images.forEach((file, index) => {
            formData.append(`images[${index}]`, file);
        });

        // Add alt_text
        if (altText) {
            formData.append('alt_text', altText);
        }

        // Add category_ids
        categoryIds.forEach((id) => {
            formData.append('category_ids[]', id.toString());
        });

        router.post(store().url, formData, {
            onSuccess: () => {
                setImages([]);
                setAltText('');
                setCategoryIds([]);
                setPreviews([]);
                setProcessing(false);
            },
            onError: () => {
                setProcessing(false);
            },
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="images">
                    Képek feltöltése (több választható)
                </Label>
                <Input
                    id="images"
                    type="file"
                    name="images[]"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                />
                {previews.length > 0 && (
                    <div className="mt-4">
                        <Label>Kiválasztott képek ({previews.length}):</Label>
                        <div className="mt-2 grid grid-cols-2 gap-4">
                            {previews.map((preview, index) => (
                                <div key={index} className="relative">
                                    <img
                                        src={preview}
                                        alt={`Előnézet ${index + 1}`}
                                        className="max-h-32 w-full rounded border object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <div>
                <Label htmlFor="alt_text">Alternatív szöveg</Label>
                <Input
                    id="alt_text"
                    type="text"
                    value={altText}
                    onChange={(e) => setAltText(e.target.value)}
                    placeholder="Kép leírása"
                />
            </div>
            <div>
                <Label>Kategóriák (több választható)</Label>
                <div className="space-y-2">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className="flex items-center space-x-2"
                        >
                            <Checkbox
                                id={`category-${category.id}`}
                                checked={categoryIds.includes(category.id)}
                                onCheckedChange={(checked) =>
                                    handleCategoryChange(
                                        category.id,
                                        checked as boolean,
                                    )
                                }
                            />
                            <Label htmlFor={`category-${category.id}`}>
                                {category.name}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            <Button type="submit" disabled={processing}>
                {processing ? 'Feltöltés...' : 'Feltöltés'}
            </Button>
        </form>
    );
}
