import { hashPassword, comparePassword } from "@/lib/auth/hash";
import { signToken } from "@/lib/auth/jwt";
import * as userService from "../user/user.service";
import * as patientService from "../patient/patient.service";

export async function register(data: any) {
  const { email, password, fullname } = data;

  const existing = await userService.findByEmail(email);

  if (existing) {
    throw new Error("User already exists");
  }



  const hashed = await hashPassword(password);

  const user = await userService.createUser(email, hashed);

  await userService.assignRole(user.userid, "patient");

  await patientService.createPatient(user.userid, fullname);

  return { message: "Registered successfully" };
}


export async function login(data: any) {
  const { email, password } = data;

  const user = await userService.findByEmail(email);
  if (!user) throw new Error("User not found");

  const valid = await comparePassword(password, user.userpassword);
  if (!valid) throw new Error("Invalid credentials");

  const token = signToken({ userId: user.userid });

  return { token };
}