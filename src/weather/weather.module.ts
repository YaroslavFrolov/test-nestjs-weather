import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { WeatherRequest } from './weather-request.model';

@Module({
  imports: [SequelizeModule.forFeature([WeatherRequest])],
  providers: [WeatherService],
  controllers: [WeatherController],
})
export class WeatherModule {}
