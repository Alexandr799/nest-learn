import { Controller, HttpCode, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileElementResponse } from './dto/file-element.respose';
import { MFile } from './mfile.class';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('file')
export class FileController {

    constructor(private fileService: FileService) {

    }

    @Post('upload')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('files'))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        const saveArray:MFile[] = [new MFile(file)]
        if (file.mimetype.includes('image')) {
            const webp = await this.fileService.convertToWebpAndResize(file.buffer, 500)
            saveArray.push(new MFile({
                originalname: `${file.originalname.split('.')[0]}.webp`,
                buffer: webp
            }))
        }
        return await this.fileService.saveFiles(saveArray)
    }
}
