'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function QualitySliders({ initialQuality = {}, onChange }) {
    const { t } = useTranslation('common');

    const [qualities, setQualities] = useState({
        size: initialQuality.size || 50,
        freshness: initialQuality.freshness || 80,
        ripeness: initialQuality.ripeness || 60,
    });

    useEffect(() => {
        if (onChange) {
            onChange(qualities);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [qualities]);

    const handleSliderChange = (key, value) => {
        setQualities(prev => ({
            ...prev,
            [key]: parseInt(value)
        }));
    };

    const getLabel = (key, value) => {
        if (key === 'size') {
            if (value < 30) return t('quality.small');
            if (value < 70) return t('quality.medium');
            return t('quality.large');
        }
        if (key === 'freshness') {
            if (value < 40) return t('quality.average');
            if (value < 80) return t('quality.fresh');
            return t('quality.farmFresh');
        }
        if (key === 'ripeness') {
            if (value < 30) return t('quality.raw');
            if (value < 70) return t('quality.semiRipe');
            return t('quality.fullyRipe');
        }
        return '';
    };

    const getColor = (value) => {
        if (value < 40) return 'bg-yellow-500';
        if (value < 80) return 'bg-green-500';
        return 'bg-green-600';
    };

    return (
        <div className="space-y-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <h3 className="font-semibold text-gray-900">{t('quality.title')}</h3>

            {/* Size */}
            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <label className="font-medium text-gray-700">{t('quality.size')}</label>
                    <span className="text-green-700 font-bold">{getLabel('size', qualities.size)}</span>
                </div>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={qualities.size}
                    onChange={(e) => handleSliderChange('size', e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                />
                <div className="flex justify-between text-xs text-gray-400">
                    <span>{t('quality.small')}</span>
                    <span>{t('quality.large')}</span>
                </div>
            </div>

            {/* Freshness */}
            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <label className="font-medium text-gray-700">{t('quality.freshness')}</label>
                    <span className="text-green-700 font-bold">{getLabel('freshness', qualities.freshness)}</span>
                </div>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={qualities.freshness}
                    onChange={(e) => handleSliderChange('freshness', e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                />
                <div className="flex justify-between text-xs text-gray-400">
                    <span>{t('quality.harvestedAgo')}</span>
                    <span>{t('quality.justHarvested')}</span>
                </div>
            </div>

            {/* Ripeness / Moisture */}
            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <label className="font-medium text-gray-700">{t('quality.ripeness')}</label>
                    <span className="text-green-700 font-bold">{getLabel('ripeness', qualities.ripeness)}</span>
                </div>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={qualities.ripeness}
                    onChange={(e) => handleSliderChange('ripeness', e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                />
                <div className="flex justify-between text-xs text-gray-400">
                    <span>{t('quality.raw')}</span>
                    <span>{t('quality.ripe')}</span>
                </div>
            </div>
        </div>
    );
}
