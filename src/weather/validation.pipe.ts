import {
  PipeTransform,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { ZodSchema } from 'zod';
import { AVAILABLE_PARTS, isValidPart } from './weather.dto';

export class PartPipe implements PipeTransform {
  transform(part?: string): string {
    if (isValidPart(part)) {
      return part || '';
    } else {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: `The query-param "part" should be string with subset of "${AVAILABLE_PARTS.join(',')}", but got the "${part}". Try remove spaces or comma at the end.`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error) {
      const message = error.errors[0]?.message || 'Validation failed';
      throw new BadRequestException(message);
    }
  }
}
