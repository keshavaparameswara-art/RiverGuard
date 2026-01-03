import { Card } from "@/components/ui/Card";
import styles from "./page.module.css";
import { AlertTriangle, CheckCircle, Clock } from "lucide-react";
import MapPreviewWrapper from "@/components/dashboard/MapPreviewWrapper";

export default function DashboardPage() {
    return (
        <div className={styles.container}>
            <div className={styles.statsGrid}>
                {/* Stats cards omitted for brevity, they remain unchanged */}
                <Card className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <span className={styles.statTitle}>Pending Cases</span>
                        <Clock size={20} className={styles.iconWarning} />
                    </div>
                    <div className={styles.statValue}>12</div>
                    <div className={styles.statTrend}>+2 from yesterday</div>
                </Card>
                <Card className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <span className={styles.statTitle}>Investigating</span>
                        <AlertTriangle size={20} className={styles.iconAlert} />
                    </div>
                    <div className={styles.statValue}>5</div>
                    <div className={styles.statTrend}>Active investigations</div>
                </Card>
                <Card className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <span className={styles.statTitle}>Resolved</span>
                        <CheckCircle size={20} className={styles.iconSuccess} />
                    </div>
                    <div className={styles.statValue}>48</div>
                    <div className={styles.statTrend}>Total this month</div>
                </Card>
            </div>

            <div className={styles.grid}>
                <Card className={styles.mapPreview} variant="glass">
                    <h3>Live Monitoring Map</h3>
                    <div className={styles.placeholderMap} style={{ overflow: 'hidden', position: 'relative' }}>
                        <MapPreviewWrapper />
                    </div>
                </Card>

                <Card className={styles.activityFeed}>
                    <h3>Recent Activity</h3>
                    <div className={styles.activityList}>
                        <div className={styles.activityItem}>
                            <div className={styles.activityDot}></div>
                            <div>
                                <p className={styles.activityText}>New encroachment detected in <strong>Zone A</strong></p>
                                <span className={styles.activityTime}>2 hours ago</span>
                            </div>
                        </div>
                        <div className={styles.activityItem}>
                            <div className={styles.activityDot}></div>
                            <div>
                                <p className={styles.activityText}>Inspector assigned to <strong>Case #124</strong></p>
                                <span className={styles.activityTime}>4 hours ago</span>
                            </div>
                        </div>
                        <div className={styles.activityItem}>
                            <div className={styles.activityDot}></div>
                            <div>
                                <p className={styles.activityText}>Case #120 marked as <strong>Resolved</strong></p>
                                <span className={styles.activityTime}>Yesterday</span>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
