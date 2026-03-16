import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

@Schema({ _id: true, timestamps: true })
export class RoomModel {
    @Prop()
    number: number

    @Prop()
    type: number

    @Prop()
    seaViewExists: boolean

    @Prop()
    images: string[]
}

export type RoomDocument = HydratedDocument<RoomModel>

export const RoomSchema = SchemaFactory.createForClass(RoomModel)
