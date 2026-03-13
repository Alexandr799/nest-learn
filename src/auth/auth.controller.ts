import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {

    }

    @Post('login')
    async login(@Body() dto: AuthDto) {
        return await this.authService.login(dto)
    }

    @Post('register')
    async register(@Body() dto: RegisterDto) {
        return await this.authService.register(dto)
    }
}
