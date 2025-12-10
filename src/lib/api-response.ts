import { NextResponse } from 'next/server';

export function successResponse<T>(data: T, message?: string, status = 200) {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
    },
    { status }
  );
}

export function errorResponse(error: string, status = 400, details?: any) {
  return NextResponse.json(
    {
      success: false,
      error,
      details,
    },
    { status }
  );
}

export function unauthorizedResponse(message = 'غير مصرح بالوصول') {
  return errorResponse(message, 401);
}

export function notFoundResponse(message = 'لم يتم العثور على المورد') {
  return errorResponse(message, 404);
}

export function validationErrorResponse(errors: any) {
  return errorResponse('خطأ في التحقق من البيانات', 422, errors);
}
