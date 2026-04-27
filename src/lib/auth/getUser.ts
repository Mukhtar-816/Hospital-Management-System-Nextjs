import { verifyToken } from "./jwt";

export function getUser(req: Request) {
  const auth = req.headers.get("authorization");

  if (!auth) throw new Error("Unauthorized");

  const token = auth.split(" ")[1];

  return verifyToken(token);
}