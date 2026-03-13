import { Body, Controller, Delete, Get, Put, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UpdateUserDto } from './dto/update.user.dto';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {

    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async profile(@Req() req: { user: { email: string } }) {
        return await this.userService.getByEmail(req.user.email);
    }

    @UseGuards(JwtAuthGuard)
    @Put('profile')
    async profileEdit(
        @Req() req,
        @Body() body: UpdateUserDto
    ) {
        return await this.userService.updateUser({
            ...body, _id: req.user._id,
        });
    }

    @UseGuards(JwtAuthGuard)
    @Delete('profile')
    async profileDelete(@Req() req) {
        return await this.userService.deleteUser(req.user._id);
    }
}
