'use client';

import dynamic from 'next/dynamic';

const LeafletMap = dynamic(
    () => import('@/components/map/LeafletMap'),
    { ssr: false, loading: () => <p>Loading Map...</p> }
);

export default function MapPreviewWrapper() {
    return (
        <LeafletMap
            center={[28.6139, 77.2090]}
            zoom={11}
            interactive={false}
        />
    );
}
