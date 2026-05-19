export interface ApiResponse<T> {
  success: boolean;
  message: string;
  requestId: string;
  data: T;
  errors?: Record<string, string> | null;
}
