import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import styles from './CaseDetailsModal.module.css';
import { X, MapPin, Calendar, Activity } from 'lucide-react';
import { Case } from '@/types';
import { updateCaseStatus } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface CaseDetailsModalProps {
    caseData: Case | null;
    isOpen: boolean;
    onClose: () => void;
}

export function CaseDetailsModal({ caseData, isOpen, onClose }: CaseDetailsModalProps) {
    const [status, setStatus] = useState(caseData?.status || 'PENDING');
    const [isUpdating, setIsUpdating] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (caseData) {
            setStatus(caseData.status);
        }
    }, [caseData]);

    const handleUpdateStatus = async () => {
        if (!caseData) return;
        setIsUpdating(true);
        const success = await updateCaseStatus(caseData.id, status);
        setIsUpdating(false);
        if (success) {
            // Ideally notify user of success
            onClose();
            // Force refresh to show new status in list
            window.location.reload();
        }
    };

    if (!isOpen || !caseData) {
        return null;
    }

    const handleDelete = async () => {
        if (!caseData || !confirm("Are you sure you want to delete this case? This action cannot be undone.")) return;

        setIsUpdating(true); // Re-using isUpdating for loading state
        // Dynamic import to avoid circular dependency issues if any
        const { deleteCase } = await import('@/lib/api');
        const success = await deleteCase(caseData.id);
        setIsUpdating(false);

        if (success) {
            onClose();
            window.location.reload();
        } else {
            alert("Failed to delete case.");
        }
    };

    return (
        <div className={styles.overlay} onClick={(e) => {
            // Close on click outside
            if (e.target === e.currentTarget) onClose();
        }}>
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
                    <Button variant="ghost" style={{ color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }} onClick={handleDelete} disabled={isUpdating}>
                        Delete Case
                    </Button>
                    <div style={{ flex: 1 }}></div>
                    <Button variant="secondary" onClick={onClose}>Close</Button>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <select
                            className={styles.statusSelect}
                            value={status}
                            onChange={(e) => setStatus(e.target.value as any)}
                            style={{ padding: '0.5rem', borderRadius: '4px', background: 'var(--card-bg)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
                        >
                            <option value="PENDING">Pending</option>
                            <option value="INVESTIGATING">Investigating</option>
                            <option value="RESOLVED">Resolved</option>
                            <option value="FALSE_ALARM">False Alarm</option>
                        </select>
                        <Button variant="primary" onClick={handleUpdateStatus} disabled={isUpdating}>
                            {isUpdating ? 'Updating...' : 'Update Status'}
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
