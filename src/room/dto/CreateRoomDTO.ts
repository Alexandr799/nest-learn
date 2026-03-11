import { IsBoolean, IsNumber, Min, MIN } from "class-validator"

export class CreateRoomDTO {
    @IsNumber()
    @Min(0)
    number: number

    @IsNumber()
    @Min(0)
    type: number

    @IsBoolean()
    seaViewExists: boolean
}