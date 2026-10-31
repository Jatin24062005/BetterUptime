import { password } from "bun"
import {z } from "zod"

export const AuthInput = z.object({
    username : z.string(),
    password :z.string(),
    name : z.string().optional(),

})