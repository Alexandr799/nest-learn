import { IsString, MaxLength, MinLength } from "class-validator"
import { CreateScheduleDTO } from "./CreateScheduleDTO"

export class UpdateScheduleDTO extends CreateScheduleDTO {
    @IsString()
    @MinLength(1)
    @MaxLength(10000)
    _id: string
}