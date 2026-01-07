'use client';

import { Card } from "@/components/ui/Card";
import styles from "./page.module.css";
import { useState, useMemo, useEffect } from "react";
import { NewCaseModal } from "@/components/cases/NewCaseModal";
import { SatelliteImageModal } from "@/components/map/SatelliteImageModal";
import dynamic from 'next/dynamic';

// Dynamic import for Leaflet map to avoid SSR issues
const LeafletMap = dynamic(
    () => import('@/components/map/LeafletMap'),
    { ssr: false, loading: () => <p>Loading Map...</p> }
);

export default function MapPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCoords, setSelectedCoords] = useState<{ lat: number, lng: number } | undefined>(undefined);
    const [isSatelliteModalOpen, setIsSatelliteModalOpen] = useState(false);
    const [selectedSatelliteImage, setSelectedSatelliteImage] = useState<any>(null);

    const [cases, setCases] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        import('@/lib/api').then(({ getCases }) => {
            getCases().then(data => {
                setCases(data);
                setIsLoading(false);
            });
        });
    }, []);

    const handleMapClick = (lat: number, lng: number) => {
        setSelectedCoords({ lat, lng });
        setIsSatelliteModalOpen(true);
    };

    const handleSatelliteImageSelect = (image: any) => {
        setSelectedSatelliteImage(image);
        setIsSatelliteModalOpen(false);
        setIsModalOpen(true);
    };

    const handleCaseCreated = () => {
        // Refresh cases
        import('@/lib/api').then(({ getCases }) => {
            getCases().then(data => {
                setCases(data);
            });
        });
    };

    // Transform cases to markers
    const markers = useMemo(() => cases.map(c => ({
        // Use random offset for demo if lat/lng missing, or real lat/lng if available.
        // Assuming Case type has lat/lng or we mock it for the demo if not present.
        // For MVP we will assume cases have location or default to Delhi region.
        lat: c.latitude || 28.6139 + (Math.random() - 0.5) * 0.1,
        lng: c.longitude || 77.2090 + (Math.random() - 0.5) * 0.1,
        title: `Case #${c.id}: ${c.title}`
    })), [cases]);

    const [center, setCenter] = useState<[number, number]>([28.6139, 77.2090]); // Default to Delhi

    useEffect(() => {
        const updateCenter = () => {
            const savedSettings = localStorage.getItem('riverguard_settings');
            if (savedSettings) {
                const { region } = JSON.parse(savedSettings);
                if (region) {
                    // Dynamic import or check to avoid server-side issues
                    import('@/lib/regions').then(({ getRegionCoords }) => {
                        const coords = getRegionCoords(region);
                        if (coords) setCenter(coords);
                    });
                }
            }
        };

        // Initial check
        updateCenter();

        // Listen for storage changes
        window.addEventListener('storage', updateCenter);
        return () => window.removeEventListener('storage', updateCenter);
    }, []);

    return (
        <div className={styles.container}>
            <Card className={styles.mapCard} variant="glass">
                <div className={styles.toolbar}>
                    <h2>Live Monitoring</h2>
                    <div className={styles.filters}>
                        <span className={styles.statusDot}></span> Live Feed Active (OpenStreetMap)
                    </div>
                </div>

                <div className={styles.mapWrapper}>
                    <LeafletMap
                        key={center.join(',')} // Force re-render on center change
                        center={center}
                        zoom={12}
                        markers={markers}
                        onMapClick={handleMapClick}
                    />
                </div>
            </Card>

            <div className={styles.sidebar}>
                <Card>
                    <h3>Detected Anomalies</h3>
                    <p>Select a marker to view details or click on the map to report a new issue.</p>
                </Card>
            </div>

            <NewCaseModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedSatelliteImage(null);
                }}
                initialLat={selectedCoords?.lat}
                initialLng={selectedCoords?.lng}
                preSelectedImage={selectedSatelliteImage}
                onSuccess={handleCaseCreated}
            />

            <SatelliteImageModal
                isOpen={isSatelliteModalOpen}
                onClose={() => setIsSatelliteModalOpen(false)}
                lat={selectedCoords?.lat || 0}
                lng={selectedCoords?.lng || 0}
                onImageSelect={handleSatelliteImageSelect}
            />
        </div>
    );
}
