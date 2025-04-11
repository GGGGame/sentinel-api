import { hideSensitiveData } from "./normalizer/hideSensitiveData";

export class ResponseTransformer {
    private readonly normalizer: Record<string, (value: string) => string> = {
        hideSensitiveData: hideSensitiveData.bind(this),
    }

    async transform(key: string, payload: any): Promise<void> {
        const normalizer = this.normalizer[key];
        if (!normalizer) {
            return;
        }

        payload = normalizer(payload);
    }
}