'use client';

import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check } from 'lucide-react';
import { prevStep } from '@/store/slices/listingSlice';

// Steps will be imported here
import StepCategory from './StepCategory';
import StepDetails from './StepDetails';
// import StepType from './StepType';
import StepQuality from './StepQuality';
import StepLocation from './StepLocation';
import StepReview from './StepReview';

export default function ListingWizard() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { currentStep, totalSteps } = useSelector((state) => state.listing);

    const handleBack = () => {
        if (currentStep === 1) {
            router.back();
        } else {
            dispatch(prevStep());
        }
    };

    // Render step content
    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <StepCategory />;
            case 2:
                return <StepDetails />;
            case 3:
                return <StepQuality />;
            case 4:
                return <StepLocation />;
            case 5:
                return <StepReview />;
            default:
                return <StepCategory />;
        }
    };

    // Calculate progress percentage
    const progress = ((currentStep - 1) / totalSteps) * 100;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col pb-20">
            {/* Header with Progress */}
            <header className="bg-white border-b sticky top-0 z-10">
                <div className="flex items-center px-4 h-14">
                    <button
                        onClick={handleBack}
                        className="p-2 -ml-2 rounded-full hover:bg-gray-100"
                        aria-label="Back"
                    >
                        <ArrowLeft className="w-6 h-6 text-gray-700" />
                    </button>
                    <h1 className="ml-2 font-semibold text-lg text-gray-900 flex-1 text-center pr-10">
                        List Your Produce
                    </h1>
                </div>
                {/* Progress Bar */}
                <div className="h-1 bg-gray-100 w-full">
                    <div
                        className="h-full bg-green-600 transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 p-4 max-w-lg mx-auto w-full">
                {renderStep()}
            </main>
        </div>
    );
}
