import zod, { email } from "zod";
export const signupVerify = zod.object({
    email: email(),
    password: zod.string().min(8, "Password too short").max(16, "Password too long")
})
export const passVerify = zod.object({
    password: zod.string().min(8, "Password too short").max(16, "Password too long")
})