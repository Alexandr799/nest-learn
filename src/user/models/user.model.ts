import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { Role } from "../../auth/enum/roles.enum";

@Schema({ _id: true, timestamps: true })
export class UserModel {
    @Prop()
    email: string

    @Prop()
    passwordHash: string

    @Prop()
    roles: Role[]

    @Prop()
    phone: string

    @Prop()
    name: string
}

export type UserDocument = HydratedDocument<UserModel>

export const UserSchema = SchemaFactory.createForClass(UserModel)