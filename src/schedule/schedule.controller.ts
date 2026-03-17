import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDTO } from './dto/CreateScheduleDTO';
import { UpdateScheduleDTO } from './dto/UpdateScheduleDTO';
import { ScheduleError } from './errors/ScheduleError';
import { SCHEDULE_NOT_FOUND } from './schedule.const';
import { Schedule } from './models/schedule.model';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { TelegramService } from 'src/telegram/telegram.service';

@Controller('schedule')
export class ScheduleController {
    constructor(
        private scheduleService: ScheduleService,
        private telegramService: TelegramService
    ) {

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
    async create(@Body() createScheduleDTO: CreateScheduleDTO, @Req() req) {
        try {
            const data = await this.scheduleService.create(createScheduleDTO)
            this.telegramService.sendMessage(`Комната: ${data.roomId} - забронировано пользователем с id: ${req.user._id}, номер бронирования - ${data._id}`)
            return data
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
    async delete(@Param('id') id: string, @Req() req) {
        const data = await this.scheduleService.delete(id)
        if (!data) {
            throw new HttpException(SCHEDULE_NOT_FOUND, HttpStatus.NOT_FOUND)
        }
        this.telegramService.sendMessage(`Бронирование комнаты: ${data.roomId} (номер бронирования - ${id}) - отменено пользователем с id: ${req.user._id}`)

        return data
    }

    @UseGuards(JwtAuthGuard)
    @Put()
    async update(@Body() updateScheduleDTO: UpdateScheduleDTO, @Req() req) {
        let data: null | Schedule;
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
        this.telegramService.sendMessage(`Бронирование: ${updateScheduleDTO._id} - изменено пользователем с id: ${req.user._id}`)
        return data;
    }
}
