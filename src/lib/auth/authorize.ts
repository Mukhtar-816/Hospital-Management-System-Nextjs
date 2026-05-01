import { getUserRoleAndPermissions } from "./permission";

export async function authorize(userid: string, requiredPermission: string) {
  if (!userid) {
    throw new Error("Unauthorized");
  }

  const result = await getUserRoleAndPermissions(userid);

  if (!result?.permissions?.includes(requiredPermission)) {
    throw new Error("Forbidden");
  }

  return result.role;
}
