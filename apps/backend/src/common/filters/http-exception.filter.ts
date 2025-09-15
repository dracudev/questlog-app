import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { HTTP_ERROR_MESSAGES, PRISMA_ERROR_CODES } from '../constants';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string = HTTP_ERROR_MESSAGES.INTERNAL_SERVER_ERROR;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any).message || message;
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      status = HttpStatus.BAD_REQUEST;
      message = this.handlePrismaError(exception);
    } else if (exception instanceof Prisma.PrismaClientValidationError) {
      status = HttpStatus.BAD_REQUEST;
      message = HTTP_ERROR_MESSAGES.INVALID_DATA;
    }

    const errorResponse = {
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
    };

    this.logger.error(
      `HTTP ${status} Error: ${message}`,
      exception instanceof Error ? exception.stack : exception,
    );

    response.status(status).json(errorResponse);
  }

  private handlePrismaError(exception: Prisma.PrismaClientKnownRequestError): string {
    switch (exception.code) {
      case PRISMA_ERROR_CODES.UNIQUE_CONSTRAINT:
        return HTTP_ERROR_MESSAGES.RECORD_EXISTS;
      case PRISMA_ERROR_CODES.RECORD_NOT_FOUND:
        return HTTP_ERROR_MESSAGES.RECORD_NOT_FOUND;
      case PRISMA_ERROR_CODES.FOREIGN_KEY_CONSTRAINT:
        return HTTP_ERROR_MESSAGES.INVALID_REFERENCE;
      case PRISMA_ERROR_CODES.QUERY_INTERPRETATION:
        return HTTP_ERROR_MESSAGES.QUERY_ERROR;
      default:
        return HTTP_ERROR_MESSAGES.DATABASE_ERROR;
    }
  }
}
