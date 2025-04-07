import { normalizeApiKey } from "./normalizer/apiKey";
import { normalizeEmail } from "./normalizer/email";
import { normalizePassword } from "./normalizer/password";
import { normalizeUsername } from "./normalizer/username";

export class RequestTransformer {
    private readonly normalizer: Record<string, (value: string) => string> = {
        normalizeEmail: normalizeEmail.bind(this),
        normalizeUsername: normalizeUsername.bind(this),
        normalizePassword: normalizePassword.bind(this),
        normalizeApiKey: normalizeApiKey.bind(this),
    }

    async transform(key: string, body: Record<string, any>, field: string): Promise<void> {
        const normalizer = this.normalizer[key];
        console.log(normalizer);
        if (!normalizer || !body[field]) {
            return;
        }

        body[field] = normalizer(body[field]);
    }
}