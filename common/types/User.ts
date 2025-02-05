interface User {
  clerkId: string;
  email: string;
  streak?: Date[];
  createdAt: Date;
  updatedAt: Date;
}

export type { User };
