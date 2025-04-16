export const hideSensitiveData = (payload: any, field: string): any => {
    return delete payload[field];
}