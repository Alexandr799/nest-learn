import { ArrayMinSize, ArrayUnique, IsArray, IsEnum, IsString, Matches, MinLength } from "class-validator";
import { Role } from "../enum/roles.enum";

export class RegisterDto {
    @IsString()
    @MinLength(1)
    login!: string;

    @IsString()
    @MinLength(1)
    password!: string;

    @IsArray()
    @ArrayUnique()
    @ArrayMinSize(1)
    @IsEnum(Role, { each: true })
    roles!: Role[]

    @IsString() 
    @Matches(/^\+?[1-9]\d{10,14}$/, { message: 'phone must be a valid phone number', })
    phone!: string
}