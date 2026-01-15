import { HttpResponseInit } from '@azure/functions';
import type { ApiResponse, ApiError, ErrorCode } from '@handled/shared';

export function success<T>(data: T, statusCode = 200): HttpResponseInit {
  const body: ApiResponse<T> = {
    success: true,
    data,
  };
  return {
    status: statusCode,
    jsonBody: body,
    headers: {
      'Content-Type': 'application/json',
    },
  };
}

export function error(
  code: ErrorCode,
  message: string,
  statusCode: number,
  details?: Record<string, unknown>
): HttpResponseInit {
  const errorBody: ApiError = {
    code,
    message,
    details,
  };
  const body: ApiResponse = {
    success: false,
    error: errorBody,
  };
  return {
    status: statusCode,
    jsonBody: body,
    headers: {
      'Content-Type': 'application/json',
    },
  };
}

export function badRequest(message: string, details?: Record<string, unknown>): HttpResponseInit {
  return error('VALIDATION_ERROR', message, 400, details);
}

export function unauthorized(message = 'Unauthorized'): HttpResponseInit {
  return error('UNAUTHORIZED', message, 401);
}

export function forbidden(message = 'Forbidden'): HttpResponseInit {
  return error('FORBIDDEN', message, 403);
}

export function notFound(message = 'Not found'): HttpResponseInit {
  return error('NOT_FOUND', message, 404);
}

export function subscriptionRequired(message = 'Premium subscription required'): HttpResponseInit {
  return error('SUBSCRIPTION_REQUIRED', message, 402);
}

export function serverError(message = 'Internal server error'): HttpResponseInit {
  return error('INTERNAL_ERROR', message, 500);
}
