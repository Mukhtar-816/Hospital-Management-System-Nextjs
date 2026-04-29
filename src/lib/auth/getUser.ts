import { verifyToken } from "./jwt";

export function getUser(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie");

    if (!cookieHeader) throw new Error("Unauthorized");

    const cookies = Object.fromEntries(
      cookieHeader.split("; ").map((c) => {
        const [key, ...v] = c.split("=");
        return [key, v.join("=")];
      })
    );

    const token = cookies["auth_token"];

    if (!token) throw new Error("Unauthorized");

    return verifyToken(token);
  } catch {
    throw new Error("Unauthorized");
  }
}