import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentStep: 1,
    totalSteps: 5,
    formData: {
        // Step 1: Basic Info
        category: '', // 'vegetables', 'fruits', 'grains'
        cropName: '',
        variety: '',

        // Step 2: Quantity & Price
        quantity: '',
        unit: 'kg',
        expectedPrice: '',

        // Step 3: Quality
        qualityGrade: '', // 'A', 'B', 'C'
        description: '',
        images: [], // Array of image URLs/blobs

        // Step 4: Location
        location: {
            lat: null,
            lng: null,
            address: ''
        },

        // Meta
        harvestDate: new Date().toISOString().split('T')[0],
        isOrganic: false
    },
    status: 'idle', // 'idle', 'loading', 'succeeded', 'failed'
    error: null
};

const listingSlice = createSlice({
    name: 'listing',
    initialState,
    reducers: {
        nextStep: (state) => {
            if (state.currentStep < state.totalSteps) {
                state.currentStep += 1;
            }
        },
        prevStep: (state) => {
            if (state.currentStep > 1) {
                state.currentStep -= 1;
            }
        },
        setStep: (state, action) => {
            state.currentStep = action.payload;
        },
        updateFormData: (state, action) => {
            // Mutate individual fields to ensure Immer handling is clean
            Object.keys(action.payload).forEach(key => {
                state.formData[key] = action.payload[key];
            });
        },
        addImage: (state, action) => {
            // max 3 images
            if (state.formData.images.length < 3) {
                state.formData.images.push(action.payload);
            }
        },
        removeImage: (state, action) => {
            state.formData.images = state.formData.images.filter((_, index) => index !== action.payload);
        },
        setLocation: (state, action) => {
            state.formData.location = action.payload;
        },
        resetListing: (state) => {
            return initialState;
        }
    }
});

export const {
    nextStep,
    prevStep,
    setStep,
    updateFormData,
    addImage,
    removeImage,
    setLocation,
    resetListing
} = listingSlice.actions;

export default listingSlice.reducer;
