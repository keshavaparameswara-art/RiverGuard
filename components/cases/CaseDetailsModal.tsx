import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import styles from './CaseDetailsModal.module.css';
import { X, MapPin, Calendar, Activity } from 'lucide-react';
import { Case } from '@/types';
import { updateCaseStatus, analyzeImages } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface CaseDetailsModalProps {
    caseData: Case | null;
    isOpen: boolean;
    onClose: () => void;
}

export function CaseDetailsModal({ caseData, isOpen, onClose }: CaseDetailsModalProps) {
    const [status, setStatus] = useState(caseData?.status || 'PENDING');
    const [isUpdating, setIsUpdating] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<{
        analysis: string;
        severity: string;
        confidence: number;
        details: any;
    } | null>(null);
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

    const handleAnalyze = async () => {
        if (!caseData || !caseData.imageUrlBefore || !caseData.imageUrlAfter) return;
        setIsAnalyzing(true);
        try {
            const result = await analyzeImages(caseData.imageUrlBefore, caseData.imageUrlAfter);
            setAnalysisResult(result);
        } catch (error) {
            setAnalysisResult("Analysis failed: " + error.message);
        }
        setIsAnalyzing(false);
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
                        <div className={styles.imageContainer}>
                            <h4>Before Image</h4>
                            {caseData.imageUrlBefore ? (
                                <img src={caseData.imageUrlBefore} alt="Before" className={styles.image} />
                            ) : (
                                <div className={styles.imagePlaceholder}>No image</div>
                            )}
                        </div>
                        <div className={styles.imageContainer}>
                            <h4>After Image</h4>
                            {caseData.imageUrlAfter ? (
                                <img src={caseData.imageUrlAfter} alt="After" className={styles.image} />
                            ) : (
                                <div className={styles.imagePlaceholder}>No image</div>
                            )}
                        </div>
                    </div>

                    {analysisResult && (
                        <div className={styles.analysisResult}>
                            <h4>AI Analysis Result</h4>
                            <div className={styles.analysisHeader}>
                                <span className={`${styles.severityBadge} ${styles[analysisResult.severity.toLowerCase()]}`}>
                                    Severity: {analysisResult.severity}
                                </span>
                                <span className={styles.confidence}>
                                    Confidence: {(analysisResult.confidence * 100).toFixed(1)}%
                                </span>
                            </div>
                            <p className={styles.analysisText}>{analysisResult.analysis}</p>

                            {analysisResult.details && Object.keys(analysisResult.details).length > 0 && (
                                <div className={styles.analysisDetails}>
                                    <h5>Analysis Details:</h5>
                                    <ul>
                                        {Object.entries(analysisResult.details).map(([key, value]) => (
                                            <li key={key}>
                                                <strong>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</strong> {String(value)}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className={styles.actions}>
                    <Button variant="ghost" style={{ color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }} onClick={handleDelete} disabled={isUpdating}>
                        Delete Case
                    </Button>
                    <Button variant="secondary" onClick={handleAnalyze} disabled={!caseData.imageUrlBefore || !caseData.imageUrlAfter || isAnalyzing}>
                        {isAnalyzing ? 'Analyzing...' : 'AI Analyze'}
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
