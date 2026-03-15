import {
  Injectable,
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { FAIL_MONTH } from './pipes.const';

@Injectable()
export class MonthValidPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    return this.normalize(value);
  }

  private normalize(value: any): any {
    let data = value
    if (typeof value !== 'string') {
      throw new BadRequestException(FAIL_MONTH)
    }

    data = parseInt(data)
    if (isNaN(data)) {
      throw new BadRequestException(FAIL_MONTH)
    }

    if (data > 12 || data < 1) {
      throw new BadRequestException(FAIL_MONTH)
    }

    return value
  }
}