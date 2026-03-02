'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Upload, Loader2, Save, Trash } from 'lucide-react';
import Link from 'next/link';
import { ApiService } from '@/services/apiService';
import { showToast } from '@/components/ui/Toast/Toast';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import QualitySliders from '@/components/ui/QualitySliders';

export default function EditListingPage({ params }) {
    const { t } = useTranslation('common');
    const router = useRouter();
    // params is a Promise in Next.js 15+, need to unwrap or use React.use()
    const { id } = use(params);

    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    // Dynamic crop types with translations
    const CROP_TYPES = [
        { value: 'Potato', label: t('listing.crops.potato') || 'Potato' },
        { value: 'Onion', label: t('listing.crops.onion') || 'Onion' },
        { value: 'Tomato', label: t('listing.crops.tomato') || 'Tomato' },
        { value: 'Wheat', label: t('listing.crops.wheat') || 'Wheat' },
        { value: 'Rice', label: t('listing.crops.rice') || 'Rice' },
        { value: 'Cotton', label: t('listing.crops.cotton') || 'Cotton' },
    ];

    const CATEGORY_OPTIONS = [
        { value: 'vegetables', label: t('categories.vegetables') || 'Vegetables' },
        { value: 'fruits', label: t('categories.fruits') || 'Fruits' },
        { value: 'grains', label: t('categories.grains') || 'Grains' },
        { value: 'spices', label: t('categories.spices') || 'Spices' },
        { value: 'flowers', label: t('categories.flowers') || 'Flowers' },
        { value: 'dairy', label: t('categories.dairy') || 'Dairy' },
    ];

    const [formData, setFormData] = useState({
        crop: '',
        category: '',
        variety: '',
        quantity: '',
        price: '',
        minQty: '',
        quality: { size: 50, freshness: 80, ripeness: 60 }
    });

    useEffect(() => {
        if (id) {
            fetchListingDetails();
        }
    }, [id]);

    const fetchListingDetails = async () => {
        setIsFetching(true);
        try {
            const listing = await ApiService.getListingById(id);
            if (listing) {
                // Parse crop name if it has variety in Parens
                // Format: "Potato (Kufri Jyoti)"
                let cropName = listing.crop || listing.name;
                let variety = '';

                if (cropName.includes('(')) {
                    const parts = cropName.split('(');
                    cropName = parts[0].trim();
                    variety = parts[1].replace(')', '').trim();
                }

                // Parse numeric values from strings like "500 kg", "₹12/kg"
                const qty = listing.quantity.replace(/\D/g, '');
                const price = listing.price.replace(/[^\d.]/g, '');
                const minQty = listing.minQty.replace(/\D/g, '');

                setFormData({
                    crop: cropName,
                    category: listing.category || '',
                    variety: variety,
                    quantity: qty,
                    price: price,
                    minQty: minQty,
                    quality: listing.quality || { size: 50, freshness: 80, ripeness: 60 }
                });
            } else {
                showToast('Listing not found', 'error');
                router.push('/farmer/dashboard');
            }
        } catch (error) {
            console.error(error);
            showToast('Failed to load listing', 'error');
        } finally {
            setIsFetching(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.crop || !formData.quantity || !formData.price) {
            showToast(t('common.fillFields') || 'Please fill all required fields', 'error');
            return;
        }

        setIsLoading(true);

        try {
            const updates = {
                cropName: `${formData.crop} ${formData.variety ? `(${formData.variety})` : ''}`.trim(),
                category: formData.category || 'vegetables',
                variety: formData.variety || '',
                quantity: parseFloat(formData.quantity),
                unit: 'kg',
                expectedPrice: parseFloat(formData.price),
                minQty: parseFloat(formData.minQty) || 50,
            };

            await ApiService.updateListing(id, updates);
            showToast(t('common.updateSuccess') || 'Listing updated successfully!', 'success');
            router.push('/farmer/dashboard');
        } catch (error) {
            console.error(error);
            showToast(t('common.error') || 'Something went wrong', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20 font-sans">
            <header className="bg-white border-b sticky top-0 z-10 px-6 py-4 shadow-sm flex items-center gap-4">
                <Link href="/farmer/dashboard" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </Link>
                <div className="flex-1">
                    <h1 className="text-xl font-bold text-gray-900">{t('listing.edit.title') || 'Edit Listing'}</h1>
                    <p className="text-sm text-gray-500">ID: {id}</p>
                </div>
            </header>

            <main className="max-w-2xl mx-auto p-6">
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">

                    {/* Image Upload Placeholder */}
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-gray-400 hover:border-green-500 hover:bg-green-50 hover:text-green-600 transition-all cursor-pointer group">
                        <div className="bg-gray-100 p-4 rounded-full mb-3 group-hover:bg-white">
                            <Upload className="w-6 h-6" />
                        </div>
                        <p className="font-medium text-sm">{t('listing.new.uploadImage')}</p>
                        <p className="text-xs text-gray-400 mt-1">{t('listing.new.imageSupport')}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Select
                            label={t('listing.new.cropName')}
                            placeholder={t('listing.new.selectCrop')}
                            options={CROP_TYPES}
                            value={formData.crop}
                            onChange={(e) => setFormData(prev => ({ ...prev, crop: e.target.value }))}
                        />
                        <Input
                            label={t('listing.new.variety')}
                            placeholder={t('listing.new.varietyPlaceholder')}
                            value={formData.variety}
                            onChange={(e) => setFormData(prev => ({ ...prev, variety: e.target.value }))}
                        />
                    </div>

                    <Select
                        label={t('listing.new.category') || 'Category'}
                        placeholder={t('listing.new.selectCategory') || 'Select a category'}
                        options={CATEGORY_OPTIONS}
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        required
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label={t('listing.new.totalQuantity')}
                            placeholder={t('listing.new.quantityPlaceholder')}
                            type="number"
                            value={formData.quantity}
                            onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                        />
                        <Input
                            label={t('listing.new.minQuantity')}
                            placeholder={t('listing.new.minQuantityPlaceholder')}
                            type="number"
                            value={formData.minQty}
                            onChange={(e) => setFormData(prev => ({ ...prev, minQty: e.target.value }))}
                        />
                    </div>

                    <Input
                        label={t('listing.new.pricePerKg')}
                        placeholder={t('listing.new.pricePlaceholder')}
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    />

                    <QualitySliders
                        initialQuality={formData.quality}
                        onChange={(q) => setFormData(prev => ({ ...prev, quality: q }))}
                    />

                    <div className="pt-4 flex gap-4">
                        <Button type="button" variant="outline" fullWidth onClick={() => router.back()}>
                            {t('common.cancel') || 'Cancel'}
                        </Button>
                        <Button type="submit" fullWidth isLoading={isLoading} disabled={isLoading}>
                            {isLoading ? t('listing.edit.saving') || 'Saving...' : t('listing.edit.saveButton') || 'Save Changes'}
                        </Button>
                    </div>

                </form>
            </main>
        </div>
    );
}
