export interface RateLimitRule {
    key: string;
    type: 'apiKey' | 'ip' | 'user';
    limit: number;
    window: number;
}