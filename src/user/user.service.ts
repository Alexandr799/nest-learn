import { BadRequestException, Injectable } from "@nestjs/common";
import { genSaltSync } from "bcryptjs";
import { UserDocument, UserModel } from "./models/user.model";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { UpdateUserDto } from "./dto/update.user.dto";
import { CreateUserDto } from "./dto/create.user.dto";

@Injectable()
export class UserService {
    constructor(
        @InjectModel(UserModel.name) private userModel: Model<UserDocument>,
    ) {

    }

    async getByEmail(email: string) {
        return this.userModel.findOne({ email })
    }

    async createUser(userDto: CreateUserDto) {
        const newUser = new this.userModel(userDto)
        return newUser.save();
    }

    async updateUser(userDto: UpdateUserDto) {
        const newUser = await this.userModel.findByIdAndUpdate(
            userDto._id,
            userDto
        ).exec()
        if (!newUser) {
            throw new BadRequestException('Не удалост обновить пользователя')
        }
        return newUser
    }

    async deleteUser(_id: string) {
        const newUser = await this.userModel.findByIdAndDelete(_id).exec()
        if (!newUser) {
            throw new BadRequestException('Не удалост удалить пользователя')
        }
        return
    }

}
