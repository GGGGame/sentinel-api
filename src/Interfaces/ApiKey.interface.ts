export interface ApiKey {
    id: string;
    key: string;
    name: string;
    userId: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    lastUsedAt: Date | null;
}