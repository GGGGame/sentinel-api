export interface LogEntry {
    id: string;
    timetamp: Date;
    method: string;
    path: string;
    status: number;
    responseTime: number;
    ip: string;
    userId?: string;
    apiKeyId?: string;
    requestBody?: any;
    responseBody?: any;
    headers?: any;
}