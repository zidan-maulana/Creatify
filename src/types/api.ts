/**
 * Standard Universal Response Envelope
 * Sesuai Dokumen 09_API_CONTRACT.md dan BACKEND_JOBDESK.md
 */

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
  meta?: {
    timestamp: string;
    total?: number;
    page?: number;
  };
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
  meta: {
    timestamp: string;
    path?: string;
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export function successResponse<T>(
  data: T,
  message?: string,
  metaExtra?: { total?: number; page?: number }
): ApiSuccessResponse<T> {
  return {
    success: true,
    data,
    ...(message ? { message } : {}),
    meta: {
      timestamp: new Date().toISOString(),
      ...metaExtra,
    },
  };
}

export function errorResponse(
  code: string,
  message: string,
  details?: Record<string, string[]>,
  path?: string
): ApiErrorResponse {
  return {
    success: false,
    error: {
      code,
      message,
      ...(details ? { details } : {}),
    },
    meta: {
      timestamp: new Date().toISOString(),
      ...(path ? { path } : {}),
    },
  };
}
