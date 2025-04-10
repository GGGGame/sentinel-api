export const hideSensitiveData = (payload: any): any => {
    const newPayload = payload.data;

    delete newPayload.id;
    delete newPayload.password;
    delete newPayload.createdAt;
    delete newPayload.updatedAt;
    delete newPayload.lastOnline;


    return newPayload;;
}