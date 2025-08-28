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

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

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
      message = 'Invalid data provided';
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
      case 'P2002':
        return 'A record with this data already exists';
      case 'P2025':
        return 'Record not found';
      case 'P2003':
        return 'Invalid reference to related record';
      case 'P2016':
        return 'Query interpretation error';
      default:
        return 'Database operation failed';
    }
  }
}
