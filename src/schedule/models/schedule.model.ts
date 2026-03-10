import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import {  HydratedDocument, Types } from "mongoose";

@Schema({ _id: true, timestamps: true })
export class ScheduleModel {
    @Prop()
    date: Date

    @Prop()
    roomId!: Types.ObjectId
}

export type ScheduleDocument = HydratedDocument<ScheduleModel>

export const ScheduleSchema = SchemaFactory.createForClass(ScheduleModel)
