import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ScheduleDocument, Schedule } from "./models/schedule.model";
import { Model } from "mongoose";
import { CreateScheduleDTO } from "./dto/CreateScheduleDTO";
import { UpdateScheduleDTO } from "./dto/UpdateScheduleDTO";
import { ScheduleError } from "./errors/ScheduleError";
import { SCHEDULE_BUSY } from "./schedule.const";

@Injectable()
export class ScheduleService {
    constructor(@InjectModel(Schedule.name) private Schedule: Model<ScheduleDocument>) {

    }

    async index(id: string) {
        return this.Schedule.findById(id).exec()
    }

    async list() {
        return this.Schedule.find().exec()
    }

    async create(createScheduleDTO: CreateScheduleDTO) {
        const date = new Date(createScheduleDTO.date)
        date.setHours(0, 0, 0, 0)

        const exists = await this.Schedule.findOne({
            date,
            roomId: createScheduleDTO.roomId
        }).exec()
        if (exists) {
            throw new ScheduleError(SCHEDULE_BUSY)
        }
        return this.Schedule.create({
            ...createScheduleDTO,
            date,
        });
    }

    async delete(id: string) {
        return this.Schedule.findByIdAndDelete(id).exec()
    }

    async update(updateScheduleDTO: UpdateScheduleDTO) {
        const date = new Date(updateScheduleDTO.date)
        date.setHours(0, 0, 0, 0)

        const updateModel = await this.Schedule.findById(updateScheduleDTO._id).exec()
        if (!updateModel) {
            return null
        }

        const exists = await this.Schedule.findOne({
            date,
            roomId: updateScheduleDTO.roomId
        }).exec()

        if (exists && exists._id.toHexString() !== updateScheduleDTO._id) {
            throw new ScheduleError(SCHEDULE_BUSY)
        }

        return this.Schedule.findOneAndUpdate(
            { _id: updateScheduleDTO._id },
            {
                ...updateScheduleDTO,
                date,
            }
        ).exec()
    }
}
