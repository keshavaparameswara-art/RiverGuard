export type Role = "ADMIN" | "INSPECTOR" | "PUBLIC";

export type Zone = {
    id: number;
    name: string;
    coordinates: { lat: number; lng: number }[];
};

export type CaseStatus = "PENDING" | "INVESTIGATING" | "VERIFIED" | "RESOLVED";
export type CaseSeverity = "LOW" | "MEDIUM" | "HIGH";

export type Case = {
    id: number;
    title: string;
    description?: string;
    latitude: number;
    longitude: number;
    status: CaseStatus;
    severity: CaseSeverity;
    imageUrlBefore?: string;
    imageUrlAfter?: string;
    zoneId?: number;
    inspectorId?: number;
    createdAt: Date;
    updatedAt: Date;
};
