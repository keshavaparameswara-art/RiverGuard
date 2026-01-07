'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import styles from './NewCaseModal.module.css';
import { X } from 'lucide-react';
import { createCase } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface SatelliteImage {
    id: string;
    date: string;
    url: string;
    thumbnail: string;
    cloudCover: number;
    resolution: number;
}

interface NewCaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialLat?: number;
    initialLng?: number;
    preSelectedImage?: SatelliteImage | null;
}

export function NewCaseModal({ isOpen, onClose, initialLat, initialLng, preSelectedImage }: NewCaseModalProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        latitude: initialLat || 28.6139,
        longitude: initialLng || 77.2090,
        severity: 'LOW',
        status: 'PENDING'
    });
    const [imageBefore, setImageBefore] = useState<File | null>(null);
    const [imageAfter, setImageAfter] = useState<File | null>(null);

    // Update form data when initial coordinates change or modal opens
    // This fixes the issue where subsequent clicks on the map didn't update the modal coordinates
    useEffect(() => {
        if (isOpen && initialLat && initialLng) {
            setFormData(prev => ({
                ...prev,
                latitude: initialLat,
                longitude: initialLng
            }));
        }
    }, [isOpen, initialLat, initialLng]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        let finalImageBefore = imageBefore;

        // If we have a pre-selected satellite image, download it and convert to File
        if (preSelectedImage && !imageBefore) {
            try {
                const response = await fetch(preSelectedImage.url);
                const blob = await response.blob();
                finalImageBefore = new File([blob], `satellite-${preSelectedImage.date}.jpg`, { type: 'image/jpeg' });
            } catch (error) {
                console.error('Failed to download satellite image:', error);
                alert('Failed to download selected satellite image. Please try again.');
                setIsSubmitting(false);
                return;
            }
        }

        await createCase(formData as any, finalImageBefore, imageAfter);
        setIsSubmitting(false);
        onClose();
        router.refresh();
        window.location.reload();
    };

    return (
        <div className={styles.overlay}>
            <Card className={styles.modal} variant="glass">
                <div className={styles.header}>
                    <h2>Report New Encroachment</h2>
                    <button onClick={onClose} className={styles.closeBtn}><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <Input
                        label="Case Title"
                        placeholder="e.g. Illegal sand mining detected"
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                        required
                    />

                    <div className={styles.row}>
                        <Input
                            label="Latitude"
                            type="number"
                            step="any"
                            value={formData.latitude}
                            onChange={e => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
                            required
                        />
                        <Input
                            label="Longitude"
                            type="number"
                            step="any"
                            value={formData.longitude}
                            onChange={e => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
                            required
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Severity</label>
                        <select
                            className={styles.select}
                            value={formData.severity}
                            onChange={e => setFormData({ ...formData, severity: e.target.value })}
                        >
                            <option value="LOW">Low Risk</option>
                            <option value="MEDIUM">Medium Risk</option>
                            <option value="HIGH">High Risk</option>
                        </select>
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Description</label>
                        <textarea
                            className={styles.textarea}
                            placeholder="Describe the observation..."
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Satellite Image Before</label>
                        {preSelectedImage ? (
                            <div className={styles.preSelectedImage}>
                                <img
                                    src={preSelectedImage.thumbnail}
                                    alt={`Selected satellite image from ${preSelectedImage.date}`}
                                    className={styles.selectedImage}
                                />
                                <div className={styles.imageDetails}>
                                    <p><strong>Date:</strong> {new Date(preSelectedImage.date).toLocaleDateString()}</p>
                                    <p><strong>Cloud Cover:</strong> {preSelectedImage.cloudCover}%</p>
                                    <p><strong>Resolution:</strong> {preSelectedImage.resolution}m</p>
                                </div>
                            </div>
                        ) : (
                            <input
                                type="file"
                                accept="image/*"
                                onChange={e => setImageBefore(e.target.files?.[0] || null)}
                                className={styles.fileInput}
                            />
                        )}
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Satellite Image After</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={e => setImageAfter(e.target.files?.[0] || null)}
                            className={styles.fileInput}
                        />
                    </div>

                    <div className={styles.actions}>
                        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Submit Report'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
