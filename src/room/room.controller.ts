import { Controller, Delete, Get, HttpException, HttpStatus, Post, Put } from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDTO } from './dto/CreateRoomDTO';
import { UpdateRoomDTO } from './dto/UpdateRoomDTO';
import { ROOM_NOT_FOUND } from './room.const';

@Controller('room')
export class RoomController {

    constructor(private roomService: RoomService) {

    }

    @Get(":id")
    async index(id: string) {
        const data = this.roomService.index(id)
        if (!data) {
            throw new HttpException(ROOM_NOT_FOUND, HttpStatus.NOT_FOUND)
        }

        return data
    }

    @Get()
    async list() {
        return this.roomService.list()
    }

    @Post()
    async create(createRoomDTO: CreateRoomDTO) {
        return this.roomService.create(createRoomDTO)
    }

    @Delete(':id')
    async delete(id: string) {
        const data = await this.roomService.delete(id)
        if (!data) {
            throw new HttpException(ROOM_NOT_FOUND, HttpStatus.NOT_FOUND)
        }

        return data
    }

    @Put()
    async update(updateRoomDTO: UpdateRoomDTO) {
        const data = await this.roomService.update(updateRoomDTO)
        if (!data) {
            throw new HttpException(ROOM_NOT_FOUND, HttpStatus.NOT_FOUND)
        }
        return data
    }
}
