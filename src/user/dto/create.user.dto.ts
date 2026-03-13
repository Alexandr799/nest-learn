import { ArrayMinSize, ArrayUnique, IsArray, IsEnum, IsString, Matches, MaxLength, MinLength } from "class-validator"
import { Role } from "../../auth/enum/roles.enum"

export class CreateUserDto  {
    @IsString()
    @MinLength(1)
    email!: string;

    @IsString()
    @MinLength(1)
    passwordHash!: string;

    @IsArray()
    @ArrayUnique()
    @ArrayMinSize(1)
    @IsEnum(Role, { each: true })
    roles!: Role[]

    @IsString() 
    @Matches(/^\+?[1-9]\d{10,14}$/, { message: 'phone must be a valid phone number', })
    phone!: string
}
