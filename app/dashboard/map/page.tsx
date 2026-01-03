'use client';

import { Card } from "@/components/ui/Card";
import styles from "./page.module.css";
import { useState, useMemo } from "react";
import { NewCaseModal } from "@/components/cases/NewCaseModal";
import dynamic from 'next/dynamic';

// Dynamic import for Leaflet map to avoid SSR issues
const LeafletMap = dynamic(
    () => import('@/components/map/LeafletMap'),
    { ssr: false, loading: () => <p>Loading Map...</p> }
);

export default function MapPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCoords, setSelectedCoords] = useState<{ lat: number, lng: number } | undefined>(undefined);

    const handleMapClick = (lat: number, lng: number) => {
        setSelectedCoords({ lat, lng });
        setIsModalOpen(true);
    };

    // Mock markers for existing cases
    const markers = useMemo(() => [
        { lat: 28.6139, lng: 77.2090, title: "Case #1" },
        { lat: 28.5355, lng: 77.3910, title: "Case #2" }
    ], []);

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
                        center={[28.6139, 77.2090]}
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
                onClose={() => setIsModalOpen(false)}
                initialLat={selectedCoords?.lat}
                initialLng={selectedCoords?.lng}
            />
        </div>
    );
}
