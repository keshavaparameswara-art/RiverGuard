'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import styles from './SatelliteImageModal.module.css';
import { X, Calendar, Cloud, Download, Check } from 'lucide-react';

interface SatelliteImage {
    id: string;
    date: string;
    url: string;
    thumbnail: string;
    cloudCover: number;
    resolution: number;
}

interface SatelliteImageModalProps {
    isOpen: boolean;
    onClose: () => void;
    lat: number;
    lng: number;
    onImageSelect: (image: SatelliteImage) => void;
}

export function SatelliteImageModal({ isOpen, onClose, lat, lng, onImageSelect }: SatelliteImageModalProps) {
    const [images, setImages] = useState<SatelliteImage[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<SatelliteImage | null>(null);

    useEffect(() => {
        if (isOpen && lat && lng) {
            fetchImages();
        }
    }, [isOpen, lat, lng]);

    const fetchImages = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/satellite?lat=${lat}&lng=${lng}`);
            const data = await response.json();
            setImages(data.images || []);
        } catch (error) {
            console.error('Failed to fetch satellite images:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectImage = () => {
        if (selectedImage) {
            onImageSelect(selectedImage);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
        }}>
            <Card className={styles.modal} variant="glass">
                <div className={styles.header}>
                    <h2>Satellite Images</h2>
                    <p className={styles.location}>Location: {lat.toFixed(4)}, {lng.toFixed(4)}</p>
                    <button onClick={onClose} className={styles.closeBtn}><X size={20} /></button>
                </div>

                <div className={styles.content}>
                    {loading ? (
                        <div className={styles.loading}>
                            <p>Loading satellite images...</p>
                        </div>
                    ) : images.length === 0 ? (
                        <div className={styles.empty}>
                            <p>No satellite images available for this location.</p>
                        </div>
                    ) : (
                        <div className={styles.imageGrid}>
                            {images.map((image) => (
                                <div
                                    key={image.id}
                                    className={`${styles.imageCard} ${selectedImage?.id === image.id ? styles.selected : ''}`}
                                    onClick={() => setSelectedImage(image)}
                                >
                                    <div className={styles.imageWrapper}>
                                        <img
                                            src={image.thumbnail}
                                            alt={`Satellite image from ${image.date}`}
                                            className={styles.thumbnail}
                                        />
                                        {selectedImage?.id === image.id && (
                                            <div className={styles.selectedOverlay}>
                                                <Check size={24} color="white" />
                                            </div>
                                        )}
                                    </div>

                                    <div className={styles.imageInfo}>
                                        <div className={styles.date}>
                                            <Calendar size={14} />
                                            <span>{new Date(image.date).toLocaleDateString()}</span>
                                        </div>
                                        <div className={styles.metadata}>
                                            <span className={styles.cloudCover}>
                                                <Cloud size={14} />
                                                {image.cloudCover}%
                                            </span>
                                            <span className={styles.resolution}>
                                                {image.resolution}m
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className={styles.actions}>
                    <Button variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button
                        variant="primary"
                        onClick={handleSelectImage}
                        disabled={!selectedImage}
                    >
                        <Download size={16} />
                        Use Selected Image
                    </Button>
                </div>
            </Card>
        </div>
    );
}