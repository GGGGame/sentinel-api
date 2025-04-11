export type TransformRequest = {
    stringToLower?: string[],
    stringTrim?: string[],
}

export type TransformResponse = {
    hideSensitiveData?: string[],
}