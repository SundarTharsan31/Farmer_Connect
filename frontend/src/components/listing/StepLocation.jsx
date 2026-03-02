'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateFormData, nextStep, setLocation } from '@/store/slices/listingSlice';
import { MapPin, ArrowRight, Crosshair, Search, Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';

export default function StepLocation() {
    const dispatch = useDispatch();
    const { formData } = useSelector((state) => state.listing);
    const [isLoadingLoc, setIsLoadingLoc] = useState(false);

    // Address Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef(null);

    // Default to center of India if no loc
    const [position, setPosition] = useState(
        formData.location.lat
            ? [formData.location.lat, formData.location.lng]
            : [20.5937, 78.9629]
    );

    // Close suggestions on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Search OpenStreetMap (Nominatim)
    useEffect(() => {
        const delayDebounce = setTimeout(async () => {
            if (searchQuery.length > 2) {
                setIsSearching(true);
                try {
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&countrycodes=in&limit=5`
                    );
                    const data = await response.json();
                    setSearchResults(data);
                    setShowSuggestions(true);
                } catch (error) {
                    console.error("Search failed", error);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setSearchResults([]);
            }
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [searchQuery]);

    // Handle Address Selection
    const handleSelectAddress = (result) => {
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);
        setPosition([lat, lng]);

        dispatch(setLocation({
            lat: lat,
            lng: lng,
            address: result.display_name
        }));

        setSearchQuery(result.display_name.split(',')[0]); // Shorten for display
        setShowSuggestions(false);
    };

    // Use Device Geolocation
    const handleUseMyLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }

        setIsLoadingLoc(true);
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const { latitude, longitude } = pos.coords;
                setPosition([latitude, longitude]);

                // Reverse Geocode to get address
                try {
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                    const data = await res.json();

                    dispatch(setLocation({
                        lat: latitude,
                        lng: longitude,
                        address: data.display_name || 'My Current Location'
                    }));
                } catch (e) {
                    // Fallback if reverse geocoding fails
                    dispatch(setLocation({
                        lat: latitude,
                        lng: longitude,
                        address: 'My Current Location'
                    }));
                }

                setIsLoadingLoc(false);
            },
            (err) => {
                console.error(err);
                alert('Unable to retrieve location. Please check browser permissions.');
                setIsLoadingLoc(false);
            },
            { enableHighAccuracy: true }
        );
    };

    // Dynamically import Map container to avoid window undefined err
    const MapComponents = useMemo(() => dynamic(
        () => import('react-leaflet').then((mod) => {
            const { MapContainer, TileLayer, Marker, useMapEvents, useMap } = mod;

            // Component to update map center when position changes
            const Recenter = ({ lat, lng }) => {
                const map = useMap();
                useEffect(() => {
                    map.setView([lat, lng], 13); // Zoom in when location found
                }, [lat, lng, map]);
                return null;
            };

            // Component to handle clicks on map
            const LocationMarker = () => {
                const map = useMapEvents({
                    click(e) {
                        const { lat, lng } = e.latlng;
                        setPosition([lat, lng]);
                        dispatch(setLocation({
                            lat: Number(lat.toFixed(6)),
                            lng: Number(lng.toFixed(6)),
                            address: 'Pinned Location'
                        }));
                    },
                });

                return position === null ? null : (
                    <Marker position={position}></Marker>
                );
            };

            return ({ position }) => (
                <MapContainer
                    center={position}
                    zoom={5}
                    scrollWheelZoom={false}
                    touchZoom={false} // Prevent accidental map movement on mobile scroll
                    dragging={true}
                    style={{ height: '300px', width: '100%', borderRadius: '12px', zIndex: 0 }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; OpenStreetMap contributors'
                    />
                    <Recenter lat={position[0]} lng={position[1]} />
                    <LocationMarker />
                </MapContainer>
            );
        }),
        {
            ssr: false,
            loading: () => <div className="h-[300px] w-full bg-gray-100 animate-pulse rounded-xl flex items-center justify-center text-gray-400">Loading Map...</div>
        }
    ), []);

    const handleNext = () => {
        if (formData.location.lat) {
            dispatch(nextStep());
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
            <div>
                <h2 className="text-xl font-bold text-gray-900">Farm Location</h2>
                <p className="text-gray-500 text-sm">Search or pin your farm location.</p>
            </div>

            <div className="space-y-4">
                {/* Search Box */}
                <div className="relative" ref={searchRef}>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setShowSuggestions(true);
                            }}
                            placeholder="Search Village / Area..."
                            className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg text-gray-900"
                        />
                        {isSearching && (
                            <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 animate-spin text-green-600" />
                        )}
                    </div>

                    {/* Suggestions Dropdown */}
                    {showSuggestions && searchResults.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-50 max-h-60 overflow-y-auto">
                            {searchResults.map((result) => (
                                <button
                                    key={result.place_id}
                                    onClick={() => handleSelectAddress(result)}
                                    className="w-full text-left px-4 py-3 hover:bg-green-50 border-b last:border-0 transition-colors flex items-start gap-2"
                                >
                                    <MapPin className="w-4 h-4 mt-1 text-gray-400 flex-shrink-0" />
                                    <span className="text-sm text-gray-700">{result.display_name}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <button
                    onClick={handleUseMyLocation}
                    disabled={isLoadingLoc}
                    className="w-full py-4 px-4 bg-blue-50 text-blue-700 rounded-xl border border-blue-200 font-semibold flex items-center justify-center gap-2 hover:bg-blue-100 transition-colors"
                >
                    {isLoadingLoc ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Getting Location...
                        </>
                    ) : (
                        <>
                            <Crosshair className="w-5 h-5" />
                            Use My Current Location
                        </>
                    )}
                </button>

                <div className="text-center text-gray-400 text-sm">- OR -</div>

                <div className="border rounded-xl shadow-sm relative z-0">
                    <MapComponents position={position} />
                </div>

                {formData.location.lat && (
                    <div className="text-sm text-green-700 bg-green-50 p-3 rounded-lg flex items-start gap-2 border border-green-100">
                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <div>
                            <span className="font-bold">Location Selected:</span>
                            <p className="opacity-90">{formData.location.address || `${formData.location.lat}, ${formData.location.lng}`}</p>
                        </div>
                    </div>
                )}
            </div>

            <button
                onClick={handleNext}
                disabled={!formData.location.lat}
                className={`
                    w-full mt-6 font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all
                    ${formData.location.lat
                        ? 'bg-green-600 hover:bg-green-700 text-white active:scale-[0.98]'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }
                `}
            >
                Review & Submit
                <ArrowRight className="w-5 h-5" />
            </button>
        </div>
    );
}
