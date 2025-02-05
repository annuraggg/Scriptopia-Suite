interface User {
  _id?: string;
  clerkId: string;
  email: string;
  streak?: Date[];
  createdAt?: Date;
  updatedAt?: Date;
}

export type { User };
