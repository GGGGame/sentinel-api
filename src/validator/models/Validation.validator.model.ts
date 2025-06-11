export const validationSchema = {
    $$strict: true,
    userId: {
        type: "number",
        nullable: false,
        messages: {
            number: "Please check your userId"
        }
    },
    route: {
        type: "string",
        nullable: false,
        messages: {
            string: "Please check your route"
        }
    },
    method: {
        type: "string",
        nullable: false,
        enum: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"],
        messages: {
            string: "Please check your method"
        }
    },
    schema: {
        type: "object",
        nullable: false,
        messages: {
            object: "Please check your schema"
        }
    },
    isActive: {
        type: "boolean",
        optional: true,
        nullable: false,
        messages: {
            boolean: "Please check your isActive"
        }
    }
}