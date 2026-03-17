import { fi, th } from "date-fns/locale"

export class MFile {
    originalname:string
    buffer:Buffer<ArrayBufferLike>

    constructor(file:Express.Multer.File | MFile ) {
        this.buffer = file.buffer
        this.originalname = file.originalname
    }
}