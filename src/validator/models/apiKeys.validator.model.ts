export const apiKeysSchema = {
    $$strict: true,
    key: {
        type: "string",
        min: 64,
        max: 64,
        nullable: false,
        messages: {
            string: "Please check your key",
            stringMin: "Your key is too short!",
            stringMax: "Your key is too long!"
        }
    },
    name: {
        type: "string",
        min: 4,
        max: 255,
        nullable: false,
        messages: {
            string: "Please check your name",
            stringMin: "Your name is too short!",
            stringMax: "Your name is too long!",
        }
    },
    user_id: {
        type: "number",
        nullable: false,
        messages: {
            number: "Please check your user_id"
        }
    },
    is_active: {
        type: "boolean",
        optional: true,
        nullable: false,
        messages: {
            boolean: "Please check is_active"
        }
    },
    last_used_at: {
        type: "date",
        optional: true,
        messages: {
            date: "Please check last_used_at"
        }
    }
}