export const updateApiKeysSchema = {
    $$strict: true,
    name: {
        type: "string",
        min: 4,
        max: 255,
        nullable: false,
        optional: true,
        messages: {
            string: "Please check your name",
            stringMin: "Your name is too short!",
            stringMax: "Your name is too long!",
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
    lastUsedAt: {
        type: "string",
        optional: true,
        nullable: true,
        messages: {
            string: "Please check your lastUsedAt"
        }
    }
}