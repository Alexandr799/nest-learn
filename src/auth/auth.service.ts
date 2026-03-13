import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { compareSync, genSaltSync, hashSync } from "bcryptjs";
import { UserService } from "../user/user.service";
import { RegisterDto } from "./dto/register.dto";
import { AuthDto } from "./dto/auth.dto";
import { USER_ALREADY_REGISTRED, USER_NOT_FOUND, WRONG_PASSWORD } from "./auth.const";

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) {

    }


    async login(dto: AuthDto) {
        const user = await this.userService.getByEmail(dto.login)

        if (!user) {
            throw new UnauthorizedException(USER_NOT_FOUND)
        }
        if (!compareSync(dto.password, user.passwordHash)) {
            throw new UnauthorizedException(WRONG_PASSWORD)
        }

        const payload = { email: user.email, roles: user.roles }
        return {
            access_token: this.jwtService.sign(payload)
        }
    }

    async register(dto: RegisterDto) {
        const salt = genSaltSync(10);
        const user = await this.userService.getByEmail(dto.login)
        if (user) {
            throw new BadRequestException(USER_ALREADY_REGISTRED);
        }
        const newUser = await this.userService.createUser({
            email: dto.login,
            passwordHash: hashSync(dto.password, salt),
            roles: dto.roles,
            phone: dto.phone,
            name: dto.name
        })

        const payload = { _id: newUser._id, email: newUser.email, roles: newUser.roles }
        return {
            access_token: this.jwtService.sign(payload)
        }
    }
}
