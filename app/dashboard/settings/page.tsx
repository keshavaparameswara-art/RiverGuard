'use client';

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useState, useEffect } from "react";
import { Save, Bell, Shield, User, Globe } from "lucide-react";
import styles from "./Settings.module.css";

import { INDIAN_REGIONS } from "@/lib/regions";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('general');
    const [settings, setSettings] = useState({
        email: '',
        apiKey: '',
        notifications: true,
        region: 'Delhi',
        theme: 'dark'
    });
    const [saved, setSaved] = useState(false);
    const [regionSuggestions, setRegionSuggestions] = useState<string[]>([]);

    useEffect(() => {
        const savedSettings = localStorage.getItem('riverguard_settings');
        if (savedSettings) {
            setSettings(JSON.parse(savedSettings));
        }
    }, []);

    const handleSave = () => {
        localStorage.setItem('riverguard_settings', JSON.stringify(settings));
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        // Dispatch a custom event so other components can listen
        window.dispatchEvent(new Event('storage'));
    };

    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <Card className={styles.menu}>
                    <button
                        className={`${styles.menuItem} ${activeTab === 'general' ? styles.active : ''}`}
                        onClick={() => setActiveTab('general')}
                    >
                        <User size={18} /> General
                    </button>
                    <button
                        className={`${styles.menuItem} ${activeTab === 'notifications' ? styles.active : ''}`}
                        onClick={() => setActiveTab('notifications')}
                    >
                        <Bell size={18} /> Notifications
                    </button>
                    <button
                        className={`${styles.menuItem} ${activeTab === 'system' ? styles.active : ''}`}
                        onClick={() => setActiveTab('system')}
                    >
                        <Shield size={18} /> System
                    </button>
                </Card>
            </div>

            <div className={styles.content}>
                <Card variant="glass" className={styles.contentCard}>
                    <div className={styles.header}>
                        <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Settings</h2>
                        <Button onClick={handleSave} className={styles.saveBtn}>
                            <Save size={16} /> {saved ? 'Saved!' : 'Save Changes'}
                        </Button>
                    </div>

                    {activeTab === 'general' && (
                        <div className={styles.formGroup}>
                            <Input
                                label="Contact Email"
                                value={settings.email}
                                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                                placeholder="admin@riverguard.com"
                            />

                            <div className={styles.regionWrapper} style={{ position: 'relative' }}>
                                <Input
                                    label="Monitoring Region"
                                    value={settings.region}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setSettings({ ...settings, region: val });
                                        if (val.length > 0) {
                                            const filtered = INDIAN_REGIONS
                                                .filter(r => r.name.toLowerCase().includes(val.toLowerCase()))
                                                .map(r => r.name);
                                            setRegionSuggestions(filtered);
                                        } else {
                                            setRegionSuggestions([]);
                                        }
                                    }}
                                    onFocus={() => {
                                        if (settings.region) {
                                            const filtered = INDIAN_REGIONS
                                                .filter(r => r.name.toLowerCase().includes(settings.region.toLowerCase()))
                                                .map(r => r.name);
                                            setRegionSuggestions(filtered);
                                        } else {
                                            setRegionSuggestions(INDIAN_REGIONS.map(r => r.name));
                                        }
                                    }}
                                    onBlur={() => setTimeout(() => setRegionSuggestions([]), 200)} // Delay to allow click
                                />
                                {regionSuggestions.length > 0 && (
                                    <ul style={{
                                        position: 'absolute',
                                        top: '100%',
                                        left: 0,
                                        right: 0,
                                        background: 'var(--card-bg)',
                                        border: '1px solid var(--border-color)',
                                        zIndex: 10,
                                        listStyle: 'none',
                                        padding: 0,
                                        margin: 0,
                                        maxHeight: '150px',
                                        overflowY: 'auto'
                                    }}>
                                        {regionSuggestions.map(r => (
                                            <li
                                                key={r}
                                                onClick={() => {
                                                    setSettings({ ...settings, region: r });
                                                    setRegionSuggestions([]);
                                                }}
                                                style={{ padding: '8px 12px', cursor: 'pointer', borderBottom: '1px solid var(--border-color)' }}
                                                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--hover-bg)'}
                                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                            >
                                                {r}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className={styles.formGroup}>
                            <div className={styles.toggleRow}>
                                <span>Enable Email Alerts</span>
                                <input
                                    type="checkbox"
                                    checked={settings.notifications}
                                    onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
                                />
                            </div>
                            <p className={styles.hint}>Receive instant alerts when new encroachments are detected.</p>
                        </div>
                    )}

                    {activeTab === 'system' && (
                        <div className={styles.formGroup}>
                            <Input
                                label="Google Maps / Leaflet API Key"
                                value={settings.apiKey}
                                onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
                                placeholder="Enter API Key..."
                            />
                            <p className={styles.hint}>Required for advanced satellite processing.</p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}
