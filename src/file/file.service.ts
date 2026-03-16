import { Injectable, Post } from '@nestjs/common';
import { path } from 'app-root-path';
import { format } from 'date-fns';
import { writeFileSync } from 'fs';
import { ensureDir } from 'fs-extra'
import { FileElementResponse } from './dto/file-element.respose';
import sharp from 'sharp';
import { MFile } from './mfile.class';
// import * as sharp from 'sharp';


@Injectable()
export class FileService {
    async saveFiles(files: MFile[]) {
        const dateFolder = format(new Date(), 'yyyy-MM-dd')
        const uploadFolder = `${path}/upload/${dateFolder}`
        await ensureDir(uploadFolder)
        let response: FileElementResponse[] = []
        for (const file of files) {
            writeFileSync(`${uploadFolder}/${file.originalname}`, file.buffer)
            response.push({
                url: `${uploadFolder}/${file.originalname}`,
                name: file.originalname
            })
        }

        return response;
    }

    async convertToWebp(file: Buffer) {
        return sharp(file).webp().toBuffer()
    }

    async convertToWebpAndResize(file: Buffer, width: number) {
        return sharp(file).webp().resize({ width: width })
            .toBuffer()
    }

}
