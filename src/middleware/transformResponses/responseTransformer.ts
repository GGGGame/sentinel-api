import { hideSensitiveData } from "./normalizer/hideSensitiveData";

export class ResponseTransformer {
    private readonly normalizer: Record<string, (value: string, field: string) => string> = {
        hideSensitiveData: hideSensitiveData.bind(this),
    }

    async transform(key: string, payload: any, field: string): Promise<void> {
        const normalizer = this.normalizer[key];
        if (!normalizer || !payload[field]) {
            return;
        }

        payload = normalizer(payload, field);
    }
}