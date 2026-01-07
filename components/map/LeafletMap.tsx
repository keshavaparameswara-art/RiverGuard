'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icon in Next.js
// Leaflet's default icon paths are broken in Webpack builds
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface LeafletMapProps {
    center: [number, number];
    zoom?: number;
    markers?: Array<{ lat: number; lng: number; title: string }>;
    onMapClick?: (lat: number, lng: number) => void;
    interactive?: boolean;
    onLoad?: () => void;
}

function ClickHandler({ onMapClick }: { onMapClick?: (lat: number, lng: number) => void }) {
    useMapEvents({
        click(e) {
            if (onMapClick) onMapClick(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
}

export default function LeafletMap({
    center,
    zoom = 13,
    markers = [],
    onMapClick,
    interactive = true,
    onLoad
}: LeafletMapProps) {
    // Leaflet needs window, so we ensure it only mounts on client
    const [mounted, setMounted] = useState(false);
    useEffect(() => { 
        setMounted(true); 
        onLoad?.();
    }, []);

    if (!mounted) return <div style={{ height: '100%', background: '#0f172a' }}>Loading Map...</div>;

    return (
        <MapContainer
            center={center}
            zoom={zoom}
            style={{ height: '100%', width: '100%' }}
            zoomControl={interactive}
            scrollWheelZoom={interactive}
            dragging={interactive}
            doubleClickZoom={interactive}
            touchZoom={interactive}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {markers.map((m, idx) => (
                <Marker key={idx} position={[m.lat, m.lng]}>
                    <Popup>{m.title}</Popup>
                </Marker>
            ))}

            {interactive && <ClickHandler onMapClick={onMapClick} />}
        </MapContainer>
    );
}
