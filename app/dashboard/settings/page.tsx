import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function SettingsPage() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <Card variant="glass">
                <h2 style={{ marginBottom: '1rem', color: 'var(--color-text-primary)' }}>System Settings</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
                    <Input label="Google Maps API Key" placeholder="Enter API Key..." />
                    <Input label="Notification Email" placeholder="admin@riverguard.com" />
                    <Button>Save Changes</Button>
                </div>
            </Card>

            <Card>
                <h3 style={{ marginBottom: '1rem', color: 'var(--color-text-primary)' }}>Zone Configuration</h3>
                <p style={{ color: 'var(--color-text-secondary)' }}>Manage detection zones and thresholds here.</p>
                <div style={{ marginTop: '1rem' }}>
                    <Button variant="secondary">Manage Zones</Button>
                </div>
            </Card>
        </div>
    );
}
