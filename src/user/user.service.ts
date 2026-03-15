import { BadRequestException, Injectable } from "@nestjs/common";
import { genSaltSync } from "bcryptjs";
import { UserDocument, User } from "./models/user.model";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { UpdateUserDto } from "./dto/update.user.dto";
import { CreateUserDto } from "./dto/create.user.dto";

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private User: Model<UserDocument>,
    ) {

    }

    async getByEmail(email: string) {
        return this.User.findOne({ email })
    }

    async createUser(userDto: CreateUserDto) {
        const newUser = new this.User(userDto)
        return newUser.save();
    }

    async updateUser(userDto: UpdateUserDto) {
        const newUser = await this.User.findByIdAndUpdate(
            userDto._id,
            userDto
        ).exec()
        if (!newUser) {
            throw new BadRequestException('Не удалост обновить пользователя')
        }
        return newUser
    }

    async deleteUser(_id: string) {
        const newUser = await this.User.findByIdAndDelete(_id).exec()
        if (!newUser) {
            throw new BadRequestException('Не удалост удалить пользователя')
        }
        return
    }

}
