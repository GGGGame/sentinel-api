import { stringToLower } from "./normalizer/stringToLower";
import { stringTrim } from "./normalizer/stringTrim";

export class RequestTransformer {
    private readonly normalizer: Record<string, (value: string) => string> = {
        stringTrim: stringTrim.bind(this),
        stringToLower: stringToLower.bind(this),
    }

    async transform(key: string, body: Record<string, any>, field: string): Promise<void> {
        const normalizer = this.normalizer[key];
        if (!normalizer || !body[field]) {
            return;
        }

        body[field] = normalizer(body[field]);
    }
}