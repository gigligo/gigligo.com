import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { McpService } from './mcp.service';
import type { Request, Response } from 'express';

@Controller('api/mcp')
export class McpController {
    constructor(private readonly mcpService: McpService) { }

    @Get('sse')
    async sse(@Req() req: Request, @Res() res: Response) {
        await this.mcpService.handleSse(req, res);
    }

    @Post('messages')
    async messages(@Req() req: Request, @Res() res: Response) {
        await this.mcpService.handlePostMessage(req, res);
    }
}
