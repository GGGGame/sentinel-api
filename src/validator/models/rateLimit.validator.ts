export const rateLimitSchema = {
    $$strict: true,
    key: {
        type: "string",
        nullable: false,
        messages: {
            string: "Please check your key"
        }
    },
    type: {
        type: "string",
        enum: ["user", "ip", "endpoint", "global"],
        nullable: false,
        messages: {
            string: "Please check your type",
            stringEnum: "Please check your type"
        }
    },
    limit: {
        type: "number",
        nullable: false,
        messages: {
            number: "Please check your limit"
        }
    },
    window: {
        type: "number",
        nullable: false,
        messages: {
            number: "Please check your window"
        }
    }
}