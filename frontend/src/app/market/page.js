'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import AuthGuard from '@/components/AuthGuard';
import { Search, Filter, ShoppingCart, Heart, MapPin, Store, SlidersHorizontal, X, Star } from 'lucide-react';
import { addToCart, openCart } from '@/store/slices/cartSlice';
import { toast } from '@/components/ui/Toast/Toast';
import { ApiService } from '@/services/apiService';
import { translateCropName } from '@/utils/translateCropName';

// Regions
const REGIONS = [
    { value: 'all', labelKey: 'market.filters.allIndia' },
    { value: 'Maharashtra', labelKey: 'market.regions.maharashtra' },
    { value: 'Punjab', labelKey: 'market.regions.punjab' },
    { value: 'Madhya Pradesh', labelKey: 'market.regions.madhyaPradesh' },
    { value: 'Karnataka', labelKey: 'market.regions.karnataka' },
    { value: 'Tamil Nadu', labelKey: 'market.regions.tamilNadu' },
    { value: 'Gujarat', labelKey: 'market.regions.gujarat' },
];

const CATEGORIES = ['vegetables', 'fruits', 'grains', 'spices', 'flowers'];

export default function MarketPage() {
    const { t } = useTranslation('common');
    const dispatch = useDispatch();
    const [mounted, setMounted] = useState(false);

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [priceRange, setPriceRange] = useState([0, 1000]);
    const [showFilters, setShowFilters] = useState(false); // Mobile filter toggle

    const [crops, setCrops] = useState([]);
    const [filteredCrops, setFilteredCrops] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setMounted(true);
        loadCrops();
    }, []);

    const loadCrops = async () => {
        try {
            const data = await ApiService.getMarketCrops();
            // Assign random categories for demo if not present
            const enhancedData = data.map(item => ({
                ...item,
                category: item.category || CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
                image: item.image || 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&q=80&w=400&h=400' // Fallback image
            }));
            setCrops(enhancedData);
            setFilteredCrops(enhancedData);
        } catch (error) {
            console.error(error);
            toast.error(t('common.error') || "Failed to load market data");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        let result = crops;

        // Filter by Region
        if (selectedRegion !== 'all') {
            result = result.filter(item => item.location.includes(selectedRegion));
        }

        // Filter by Category
        if (selectedCategory !== 'all') {
            result = result.filter(item => item.category === selectedCategory);
        }

        // Filter by Search
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(item =>
                item.name.toLowerCase().includes(q) ||
                item.farmer.toLowerCase().includes(q)
            );
        }

        setFilteredCrops(result);
    }, [selectedRegion, selectedCategory, searchQuery, crops]);

    const handleAddToCart = (item) => {
        dispatch(addToCart({
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            farmer: item.farmer,
            minQty: item.minQty,
            quantity: 1 // Default to 1 unit
        }));
        toast.success(t('cart.added') || `${item.name} added to cart!`);
        dispatch(openCart());
    };

    if (!mounted) return null;

    return (
        <AuthGuard>
            <div className="min-h-screen bg-gray-50 pb-24 font-sans">
                <main className="max-w-7xl mx-auto p-4 md:p-6">
                    {/* Page Title + Search */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <div className="flex items-center justify-between w-full md:w-auto">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{t('nav.market')}</h1>
                                <p className="text-gray-500 text-sm mt-1">{t('market.subtitle')}</p>
                            </div>

                            {/* Mobile Filter Toggle */}
                            <button
                                className="md:hidden p-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200"
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                <SlidersHorizontal className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto bg-gray-100 rounded-xl px-4 py-2 ring-1 ring-gray-200 focus-within:ring-2 focus-within:ring-green-500 focus-within:bg-white transition-all">
                            <Search className="w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder={t('market.searchPlaceholder')}
                                className="bg-transparent border-none outline-none text-sm w-full md:w-80 text-gray-900 placeholder-gray-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar Filters */}
                        <aside className={`fixed inset-0 z-30 bg-white lg:static lg:bg-transparent lg:w-64 lg:block ${showFilters ? 'block' : 'hidden'} h-full overflow-y-auto lg:h-auto lg:overflow-visible p-4 lg:p-0 shadow-xl lg:shadow-none transition-all duration-300`}>
                            <div className="flex justify-between items-center lg:hidden mb-4">
                                <h3 className="font-bold text-lg text-gray-900">{t('market.filters.title') || 'Filters'}</h3>
                                <button onClick={() => setShowFilters(false)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Categories */}
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-3 block">{t('market.filters.categories')}</h3>
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 cursor-pointer group">
                                            <input
                                                type="radio"
                                                name="category"
                                                className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300"
                                                checked={selectedCategory === 'all'}
                                                onChange={() => setSelectedCategory('all')}
                                            />
                                            <span className="text-gray-600 group-hover:text-green-700 transition-colors">{t('market.filters.allCategories')}</span>
                                        </label>
                                        {CATEGORIES.map(cat => (
                                            <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                                                <input
                                                    type="radio"
                                                    name="category"
                                                    className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300"
                                                    checked={selectedCategory === cat}
                                                    onChange={() => setSelectedCategory(cat)}
                                                />
                                                <span className="text-gray-600 group-hover:text-green-700 transition-colors capitalize">{t('categories.' + cat)}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Regions */}
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-3 block">{t('market.filters.regions')}</h3>
                                    <select
                                        className="w-full p-2.5 bg-white border border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all"
                                        value={selectedRegion}
                                        onChange={(e) => setSelectedRegion(e.target.value)}
                                    >
                                        {REGIONS.map(region => (
                                            <option key={region.value} value={region.value}>
                                                {region.label || t(region.labelKey)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </aside>

                        {/* Grid Content */}
                        <div className="flex-1">
                            {isLoading ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {[1, 2, 3, 4, 5, 6].map(i => (
                                        <div key={i} className="bg-white rounded-2xl h-80 animate-pulse border border-gray-100"></div>
                                    ))}
                                </div>
                            ) : filteredCrops.length === 0 ? (
                                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                                    <h3 className="text-lg font-bold text-gray-900">{t('market.noCrops.title')}</h3>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredCrops.map((item) => (
                                        <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all group flex flex-col">
                                            {/* Image */}
                                            <div className="relative h-48 overflow-hidden bg-gray-100">
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1">
                                                    <MapPin className="w-3 h-3" />
                                                    {item.location}
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="p-5 flex-1 flex flex-col">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="font-bold text-gray-900 text-lg truncate pr-2">{translateCropName(item.name, t)}</h3>
                                                    <div className="flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded text-xs font-bold text-green-700">
                                                        <Star className="w-3 h-3 fill-green-700" /> {item.rating}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
                                                    <Store className="w-3.5 h-3.5" />
                                                    <span className="truncate">{item.farmer}</span>
                                                </div>

                                                <div className="mt-auto flex items-end justify-between gap-4">
                                                    <div>
                                                        <p className="text-2xl font-bold text-green-700">{item.price}</p>
                                                        <p className="text-xs text-gray-400 font-medium">{t('market.card.min')} {item.minQty} {item.unit}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleAddToCart(item)}
                                                        className="bg-green-600 text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-green-700 active:scale-95 transition-all shadow-lg shadow-green-100 flex items-center gap-2"
                                                    >
                                                        <ShoppingCart className="w-4 h-4" />
                                                        {t('market.card.add')}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </AuthGuard>
    );
}
