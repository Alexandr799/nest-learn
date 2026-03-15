import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import {  HydratedDocument, Types } from "mongoose";

@Schema({ _id: true, timestamps: true })
export class Schedule {
    @Prop()
    date: Date

    @Prop()
    roomId!: Types.ObjectId
}

export type ScheduleDocument = HydratedDocument<Schedule>

export const ScheduleSchema = SchemaFactory.createForClass(Schedule)
