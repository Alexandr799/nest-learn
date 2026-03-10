import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { RoomDocument, RoomModel } from "./models/room.model";
import { Model } from "mongoose";
import { UpdateRoomDTO } from "./dto/UpdateRoomDTO";
import { CreateRoomDTO } from "./dto/CreateRoomDTO";

@Injectable()
export class RoomService {
    constructor(@InjectModel(RoomModel.name) private roomModel: Model<RoomDocument>) {

    }

    async index(id: string) {
        return this.roomModel.findById(id).exec()
    }

    async list() {
        return this.roomModel.find().exec()
    }

    async create(createRoomDTO: CreateRoomDTO) {
        return this.roomModel.create(createRoomDTO)
    }

    async delete(id: string) {
        return this.roomModel.findByIdAndDelete(id).exec()
    }

    async update(updateRoomDTO: UpdateRoomDTO) {
        return this.roomModel.findOneAndUpdate({ _id: updateRoomDTO._id }, updateRoomDTO).exec()
    }

}
