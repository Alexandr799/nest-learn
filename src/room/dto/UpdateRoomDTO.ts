import { IsString, MaxLength, MinLength } from "class-validator"
import { CreateRoomDTO } from "./CreateRoomDTO"

export class UpdateRoomDTO extends CreateRoomDTO {
    @IsString()
    @MinLength(1)
    @MaxLength(10000)
    _id: string
}