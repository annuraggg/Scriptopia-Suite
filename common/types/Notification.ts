export type NotificationPlatform =
  | "enterprise"
  | "campus"
  | "code"
  | "candidate"
  | "meet";

export interface Notification {
  _id?: string;
  userIds: string;
  title: string;
  message: string;
  platform: NotificationPlatform;
  readBy?: string[];
  createdAt?: Date;
}
