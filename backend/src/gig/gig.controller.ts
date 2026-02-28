import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { GigService } from './gig.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('api/gigs')
export class GigController {
    constructor(private readonly gigService: GigService) { }

    @Get()
    findAll(@Query() query: any) {
        return this.gigService.findAll(query);
    }

    @Get('mine')
    @UseGuards(JwtAuthGuard)
    findMine(@Request() req: any) {
        return this.gigService.findMine(req.user.id);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.gigService.findOne(id);
    }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('SELLER', 'STUDENT', 'FREE')
    create(@Request() req: any, @Body() data: any) {
        return this.gigService.create(req.user.id, data);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('SELLER', 'STUDENT', 'FREE')
    update(@Request() req: any, @Param('id') id: string, @Body() data: any) {
        return this.gigService.update(id, req.user.id, data);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('SELLER', 'STUDENT', 'FREE')
    deleteGig(@Request() req: any, @Param('id') id: string) {
        return this.gigService.deleteGig(id, req.user.id);
    }
}
