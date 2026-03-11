import { IsDate, IsDateString, IsString, MaxLength, MinLength } from "class-validator"

export class CreateScheduleDTO {

    @IsDateString()
    date: Date

    @IsString()
    @MinLength(1)
    @MaxLength(10000)
    roomId: string
}