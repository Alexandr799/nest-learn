import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDTO } from './dto/CreateScheduleDTO';
import { UpdateScheduleDTO } from './dto/UpdateScheduleDTO';
import { ScheduleError } from './errors/ScheduleError';
import { SCHEDULE_NOT_FOUND } from './schedule.const';
import { ScheduleModel } from './models/schedule.model';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('schedule')
export class ScheduleController {
    constructor(private scheduleService: ScheduleService) {

    }

    @Get(':id')
    async index(@Param('id') id: string) {
        const data = await this.scheduleService.index(id)
        if (!data) {
            throw new HttpException(SCHEDULE_NOT_FOUND, HttpStatus.NOT_FOUND)
        }

        return data
    }

    @Get()
    async list() {
        return await this.scheduleService.list()
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() createScheduleDTO: CreateScheduleDTO) {
        try {
            return await this.scheduleService.create(createScheduleDTO)
        } catch (e) {
            if (e instanceof ScheduleError) {
                throw new HttpException(e.message, HttpStatus.BAD_REQUEST)
            } else {
                throw e
            }
        }
    }

    @UseGuards(JwtAuthGuard)
    @Delete(":id")
    async delete(@Param('id') id: string) {
        const data = await this.scheduleService.delete(id)
        if (!data) {
            throw new HttpException(SCHEDULE_NOT_FOUND, HttpStatus.NOT_FOUND)
        }

        return data
    }

    @UseGuards(JwtAuthGuard)
    @Put()
    async update(@Body() updateScheduleDTO: UpdateScheduleDTO) {
        let data:null|ScheduleModel;
        try {
            data = await this.scheduleService.update(updateScheduleDTO)
        } catch (e) {
            if (e instanceof ScheduleError) {
                throw new HttpException(e.message, HttpStatus.BAD_REQUEST)
            } else {
                throw e
            }
        }

        if (!data) {
            throw new HttpException(SCHEDULE_NOT_FOUND, HttpStatus.NOT_FOUND)
        }
        return data;
    }
}
