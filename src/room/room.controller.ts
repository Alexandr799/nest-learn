import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDTO } from './dto/CreateRoomDTO';
import { UpdateRoomDTO } from './dto/UpdateRoomDTO';
import { ROOM_NOT_FOUND } from './room.const';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enum/roles.enum';

@Controller('room')
export class RoomController {

    constructor(private roomService: RoomService) {

    }

    @Get(":id")
    async index(@Param('id') id: string) {
        const data = await this.roomService.index(id)
        if (!data) {
            throw new HttpException(ROOM_NOT_FOUND, HttpStatus.NOT_FOUND)
        }

        return data
    }

    @Get()
    async list() {
        return this.roomService.list()
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Post()
    async create(@Body() createRoomDTO: CreateRoomDTO) {
        return this.roomService.create(createRoomDTO)
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Delete(':id')
    async delete(@Param('id') id: string) {
        const data = await this.roomService.delete(id)
        if (!data) {
            throw new HttpException(ROOM_NOT_FOUND, HttpStatus.NOT_FOUND)
        }

        return data
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Put()
    async update(@Body() updateRoomDTO: UpdateRoomDTO) {
        const data = await this.roomService.update(updateRoomDTO)
        if (!data) {
            throw new HttpException(ROOM_NOT_FOUND, HttpStatus.NOT_FOUND)
        }
        return data
    }
}
