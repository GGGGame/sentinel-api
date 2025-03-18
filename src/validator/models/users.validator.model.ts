export const usersSchema = {
    name: {
        type: "string",
        min: 1,
        max: 255,
        nullable: false,
        messages: {
            string: "Please check your name",
        }
    },
    password: {
        type: "string",
        min: 8,
        nullable: false,
        messages: {
            string: "Please check your password",
            stringMin: "Your password is too short!"
        }
    },
    email: {
        type: "email",
        max: 255,
        nullable: false,
        messages: {
            string: "Please insert a valid Email"
        }
    }
}