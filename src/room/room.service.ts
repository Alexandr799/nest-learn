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

    async getStatByMonth(month: number) {
        if (![1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].includes(month)) {
            return [];
        }

        return this.roomModel.aggregate([
            {
                $lookup: {
                    from: 'schedule',
                    let: { roomId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$roomId', '$$roomId'] },
                                        { $eq: [{ $month: '$date' }, month] },
                                    ],
                                },
                            },
                        },
                    ],
                    as: 'bookings',
                },
            },
            {
                $project: {
                    _id: 0,
                    roomId: '$_id',
                    number: 1,
                    bookedDays: { $size: '$bookings' },
                },
            },
            {
                $sort: { number: 1 },
            },
        ]);
    }

}
