import { NextResponse } from 'next/server';

interface SatelliteImage {
    id: string;
    date: string;
    url: string;
    thumbnail: string;
    cloudCover: number;
    resolution: number;
}

// Generate a simple base64 encoded placeholder image
function generateBase64Image(width: number, height: number, text: string): string {
    // Create a simple SVG as base64
    const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#1e293b"/>
        <text x="50%" y="50%" font-family="Arial" font-size="24" fill="white" text-anchor="middle" dy=".3em">${text}</text>
    </svg>`;
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

// Mock satellite image data for demonstration
function getMockSatelliteImages(lat: number, lng: number): SatelliteImage[] {
    const baseDate = new Date();
    const images: SatelliteImage[] = [];

    // Generate mock images for the last 2 years
    for (let i = 0; i < 24; i++) {
        const imageDate = new Date(baseDate);
        imageDate.setMonth(baseDate.getMonth() - i);

        // Generate base64 encoded images instead of external URLs
        const dateStr = imageDate.toISOString().split('T')[0];
        const mockUrl = generateBase64Image(1024, 1024, `Satellite ${dateStr}`);
        const thumbnailUrl = generateBase64Image(256, 256, dateStr);

        images.push({
            id: `sat_${i}`,
            date: dateStr,
            url: mockUrl,
            thumbnail: thumbnailUrl,
            cloudCover: Math.floor(Math.random() * 30), // 0-30% cloud cover
            resolution: 10 // 10m resolution
        });
    }

    return images.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const lat = parseFloat(searchParams.get('lat') || '0');
        const lng = parseFloat(searchParams.get('lng') || '0');

        if (!lat || !lng) {
            return NextResponse.json({ error: "Latitude and longitude required" }, { status: 400 });
        }

        // For demo purposes, return mock satellite images
        // In production, integrate with Sentinel Hub API:
        /*
        const sentinelResponse = await fetch(`https://services.sentinel-hub.com/api/v1/process`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.SENTINEL_HUB_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                input: {
                    bounds: {
                        bbox: [lng - 0.01, lat - 0.01, lng + 0.01, lat + 0.01]
                    },
                    data: [{
                        type: "sentinel-2-l2a",
                        dataFilter: {
                            timeRange: {
                                from: "2020-01-01T00:00:00Z",
                                to: new Date().toISOString()
                            }
                        }
                    }]
                },
                output: {
                    width: 1024,
                    height: 1024
                }
            })
        });
        */

        const images = getMockSatelliteImages(lat, lng);

        return NextResponse.json({
            images,
            location: { lat, lng },
            total: images.length
        });

    } catch (error) {
        console.error('Satellite image fetch error:', error);
        return NextResponse.json({ error: "Failed to fetch satellite images" }, { status: 500 });
    }
}