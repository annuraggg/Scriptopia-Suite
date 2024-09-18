interface Response<T> {
  success: boolean;
  error: string;
  data: T;
}

export type { Response };
