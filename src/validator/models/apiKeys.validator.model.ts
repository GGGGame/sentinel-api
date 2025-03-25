export const apiKeysSchema = {
    $$strict: true,
    key: {
        type: "string",
        min: 64,
        max: 64,
        nullable: false,
        messages: {
            string: "Please check your key",
            stringMin: "Required 64 char min",
            stringMax: "Required 64 char max"
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
    userId: {
        type: "number",
        nullable: false,
        messages: {
            number: "Please check your userId"
        }
    }
}