import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function Home() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      gap: '2rem',
      background: 'radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)'
    }}>
      <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
        River<span style={{ color: 'var(--color-accent)' }}>Guard</span>
      </h1>
      <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.25rem' }}>
        AI-Powered Illegal Encroachment Detection System
      </p>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link href="/dashboard">
          <Button size="lg">Enter Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
