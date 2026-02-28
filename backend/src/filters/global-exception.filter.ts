import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(GlobalExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let errorData = null;

        // 1. Handle standard NestJS HTTP Exceptions
        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const res = exception.getResponse();
            message = typeof res === 'string' ? res : (res as any).message || exception.message;
            errorData = typeof res !== 'string' && (res as any).error ? (res as any).error : null;
        }
        // 2. Handle Prisma specific database errors securely
        else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
            status = HttpStatus.BAD_REQUEST;
            if (exception.code === 'P2002') {
                message = 'A record with this value already exists (Unique constraint violation).';
            } else if (exception.code === 'P2025') {
                status = HttpStatus.NOT_FOUND;
                message = 'Record not found in the database.';
            } else {
                message = `Database Error: ${exception.message.split('\n').pop()}`;
            }
        }
        // 3. Fallback for unexpected generic errors
        else if (exception instanceof Error) {
            this.logger.error(`Unhandled Exception: ${exception.message}`, exception.stack);
            message = process.env.NODE_ENV === 'development' ? exception.message : 'An unexpected error occurred';
        }

        // Standardized Gigligo JSON Error Payload
        response.status(status).json({
            success: false,
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: Array.isArray(message) ? message[0] : message, // class-validator returns arrays
            error: errorData,
        });
    }
}
