import { pool } from "@/lib/db";

export interface Notification {
  notificationId: string;
  messageText: string;
  TStamp: Date;
  userid: string;
}

export async function getNotificationsByUserId(
  userId: string,
): Promise<Notification[]> {
  const result = await pool.query(
    `SELECT 
      notificationId as "notificationId", 
      messageText as "messageText", 
      TStamp as "TStamp"
    FROM Notifications 
    WHERE userid = $1 
    ORDER BY TStamp DESC`,
    [userId],
  );
  return result.rows;
}
