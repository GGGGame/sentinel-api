import { Request } from "express"

class RateLimiterController {
    
    private async getKeyAndType(req: Request): Promise<{ key: string | number, type: string }> {
        if (req.user) return { key: req.user.id, type: "user" };
        if (req.path) return { key: req.path, type: "path" };
        return { key: req.ip, type: "ip" };
    }

}