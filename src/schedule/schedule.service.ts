import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ScheduleDocument, ScheduleModel } from "./models/schedule.model";
import { Model } from "mongoose";
import { CreateScheduleDTO } from "./dto/CreateScheduleDTO";
import { UpdateScheduleDTO } from "./dto/UpdateScheduleDTO";
import { ScheduleError } from "./errors/ScheduleError";
import { SCHEDULE_BUSY } from "./schedule.const";

@Injectable()
export class ScheduleService {
    constructor(@InjectModel(ScheduleModel.name) private scheduleModel: Model<ScheduleDocument>) {

    }

    async index(id: string) {
        return this.scheduleModel.findById(id).exec()
    }

    async list() {
        return this.scheduleModel.find().exec()
    }

    async create(createScheduleDTO: CreateScheduleDTO) {
        const exists = await this.scheduleModel.findOne({
            date: new Date(createScheduleDTO.date),
            roomId: createScheduleDTO.roomId
        }).exec()
        if (exists) {
            throw new ScheduleError(SCHEDULE_BUSY)
        }
        return this.scheduleModel.create(createScheduleDTO)
    }

    async delete(id: string) {
        return this.scheduleModel.findByIdAndDelete(id).exec()
    }

    async update(updateScheduleDTO: UpdateScheduleDTO) {
        const exists = await this.scheduleModel.findOne({
            date: new Date(updateScheduleDTO.date), roomId: updateScheduleDTO.roomId
        }).exec()

        if (exists) {
            throw new ScheduleError(SCHEDULE_BUSY)
        }

        return this.scheduleModel.findOneAndUpdate({ _id: updateScheduleDTO._id }, updateScheduleDTO).exec()
    }
}
