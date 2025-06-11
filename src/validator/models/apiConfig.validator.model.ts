export const apiConfigSchema = {
    $$strict: true,
    userId: {
        type: "number",
        optional: true,
        nullable: false,
        messages: {
            number: "Please check your userId"
        }
    },
    isActive: {
        type: "boolean",
        optional: true,
        nullable: false,
        messages: {
            boolean: "Please check your isActive"
        }
    },
    transformRequest: {
        type: "object",
        optional: true,
        nullable: true,
        messages: {
            object: "Please check your transformRequest"
        }
    },
    transformResponse: {
        type: "object",
        optional: true,
        nullable: true,
        messages: {
            object: "Please check your transformResponse"
        }
    },
}