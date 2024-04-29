import { z } from "zod";
import { UserWithZipCode } from "../interfaces/ICreateUser";

export function validateUserData(userData: UserWithZipCode) {
    const userSchema = z.object({
      email: z.string({
        required_error: "Email is required",
        invalid_type_error: "Email must be a valid email address",
      }).email(),
      password: z.string({
        required_error: "Password is required",
        invalid_type_error: "Password must be a string with at least eight characters",
      }).min(8).max(100),
      firstName: z.string({
        required_error: "First name is required",
        invalid_type_error: "First name must be a string with maximum thirty characters",
      }).min(1).max(30),
      lastName: z.string({
        required_error: "Last name is required",
        invalid_type_error: "Last name must be a string with maximum fifty characters",
      }).min(1).max(50),
      zipcode: z.string().min(8).max(8).optional(),
    });
    
    return userSchema.safeParse(userData);
}