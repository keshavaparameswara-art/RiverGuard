'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import styles from './CaseDetailsModal.module.css';
import { X, MapPin, Calendar, Activity } from 'lucide-react';
import { Case } from '@/types';

interface CaseDetailsModalProps {
    caseData: Case | null;
    isOpen: boolean;
    onClose: () => void;
}

export function CaseDetailsModal({ caseData, isOpen, onClose }: CaseDetailsModalProps) {
    if (!isOpen || !caseData) return null;

    return (
        <div className={styles.overlay}>
            <Card className={styles.modal} variant="glass">
                <div className={styles.header}>
                    <h2>Case #{caseData.id}</h2>
                    <button onClick={onClose} className={styles.closeBtn}><X size={20} /></button>
                </div>

                <div className={styles.content}>
                    <div className={styles.statusBadge} data-severity={caseData.severity}>
                        Severity: {caseData.severity}
                    </div>

                    <h3 className={styles.title}>{caseData.title}</h3>
                    <p className={styles.description}>{caseData.description || "No description provided."}</p>

                    <div className={styles.metaGrid}>
                        <div className={styles.metaItem}>
                            <Activity size={16} />
                            <span>Status: <strong>{caseData.status}</strong></span>
                        </div>
                        <div className={styles.metaItem}>
                            <MapPin size={16} />
                            <span>{caseData.latitude.toFixed(4)}, {caseData.longitude.toFixed(4)}</span>
                        </div>
                        <div className={styles.metaItem}>
                            <Calendar size={16} />
                            <span>{new Date(caseData.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>

                    <div className={styles.images}>
                        <div className={styles.imagePlaceholder}>Before Image</div>
                        <div className={styles.imagePlaceholder}>After Image</div>
                    </div>
                </div>

                <div className={styles.actions}>
                    <Button variant="secondary" onClick={onClose}>Close</Button>
                    <Button variant="primary">Update Status</Button>
                </div>
            </Card>
        </div>
    );
}
