import { IsString, MinLength } from "class-validator"
import { CreateUserDto } from "./create.user.dto"

export class UpdateUserDto extends CreateUserDto {
    @IsString()
    @MinLength(1)
    _id:string
}
