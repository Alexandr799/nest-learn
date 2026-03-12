import {
  Injectable,
  PipeTransform,
  ArgumentMetadata,
} from '@nestjs/common';

@Injectable()
export class TrimPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    return this.normalize(value);
  }

  private normalize(value: any): any {
    if (typeof value === 'string') {
      const trimmed = value.trim();
      return trimmed === '' ? null : trimmed;
    }

    if (Array.isArray(value)) {
      return value.map(item => this.normalize(item));
    }

    if (value && typeof value === 'object') {
      const result: Record<string, any> = {};

      for (const key of Object.keys(value)) {
        result[key] = this.normalize(value[key]);
      }

      return result;
    }

    return value;
  }
}