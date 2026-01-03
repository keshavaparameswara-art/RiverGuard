'use client';

import dynamic from 'next/dynamic';

const LeafletMap = dynamic(
    () => import('@/components/map/LeafletMap'),
    { ssr: false, loading: () => <p>Loading Map...</p> }
);

import { useState, useEffect } from 'react';
import { getRegionCoords } from '@/lib/regions';

export default function MapPreviewWrapper({ interactive = true }: { interactive?: boolean }) {
    const [center, setCenter] = useState<[number, number]>([28.6139, 77.2090]);
    const [markers, setMarkers] = useState<any[]>([]);

    useEffect(() => {
        // Fetch cases to show on map
        import('@/lib/api').then(({ getCases }) => {
            getCases().then(data => {
                const newMarkers = data.map(c => ({
                    lat: c.latitude,
                    lng: c.longitude,
                    title: `Case #${c.id}: ${c.title}`
                }));
                setMarkers(newMarkers);
            });
        });

        // Function to update center from settings
        const updateFromSettings = () => {
            const saved = localStorage.getItem('riverguard_settings');
            if (saved) {
                const { region } = JSON.parse(saved);
                const coords = getRegionCoords(region);
                if (coords) setCenter(coords);
            }
        };

        updateFromSettings();

        // Listen for updates from settings page
        // Note: 'storage' event usually only triggers across tabs, so we might need a custom event dispatch
        // if we want it to update instantly within the same tab/session if they switch pages without reload.
        // We added window.dispatchEvent in SettingsPage to handle this.
        window.addEventListener('storage', updateFromSettings);
        return () => window.removeEventListener('storage', updateFromSettings);
    }, []);

    return (
        <LeafletMap
            key={center.join(',')} // Force re-render on move
            center={center}
            zoom={11}
            markers={markers}
            interactive={interactive}
        />
    );
}
