import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  ParseFloatPipe,
  UsePipes,
  UseInterceptors,
} from '@nestjs/common';
import { WeatherDTO, weatherSchema } from './weather.dto';
import { WeatherService } from './weather.service';
import { PartPipe, ZodValidationPipe } from './validation.pipe';
import { WeatherGetInterceptor } from './weather-get.interceptor';

@Controller('weather')
export class WeatherController {
  constructor(private weatherService: WeatherService) {}

  @UseInterceptors(new WeatherGetInterceptor())
  @Get()
  async get(
    @Query('lat', ParseFloatPipe) lat: number,
    @Query('lon', ParseFloatPipe) lon: number,
    @Query('part', PartPipe) part?: string,
  ): Promise<unknown> {
    const payload = {
      lat: lat,
      lon: lon,
      part: String(part),
    };
    return this.weatherService.getDataFromStorage(payload);
  }

  @Post()
  @UsePipes(new ZodValidationPipe(weatherSchema))
  async post(@Body() body: WeatherDTO): Promise<unknown> {
    return this.weatherService.fetchDataAndPutToStorage(body);
  }
}
