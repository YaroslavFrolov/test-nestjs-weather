import {
  Injectable,
  BadRequestException,
  ServiceUnavailableException,
  BadGatewayException,
} from '@nestjs/common';
import { Op } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import { WeatherRequest } from './weather-request.model';
import { WeatherDTO } from './weather.dto';
import fetch from 'node-fetch';

@Injectable()
export class WeatherService {
  constructor(
    @InjectModel(WeatherRequest)
    private weatherRequestModel: typeof WeatherRequest,
  ) {}

  async getDataFromStorage(payload: WeatherDTO): Promise<unknown> {
    return await this.weatherRequestModel.findOne({
      where: {
        [Op.and]: {
          lat: String(payload.lat),
          lon: String(payload.lon),
        },
      },
      raw: true,
    });
  }

  async fetchDataAndPutToStorage(body: WeatherDTO): Promise<unknown> {
    const { lat, lon, part } = body;
    const { WEATHER_BASE_URL, WEATHER_API_KEY } = process.env;

    if (!WEATHER_BASE_URL || !WEATHER_API_KEY)
      throw new ServiceUnavailableException("Can't find env-variables");

    /**
     * For sure we can put the "fetching-logic" somewhere in specific layer/service
     * of application. But for now don't see reasons for that.
     */
    const addr = new URL(WEATHER_BASE_URL);
    addr.searchParams.append('appid', WEATHER_API_KEY);
    addr.searchParams.append('lat', String(lat));
    addr.searchParams.append('lon', String(lon));
    if (part) {
      addr.searchParams.append('exclude', part);
    }

    const response = await fetch(addr.href);

    if (!response.ok) {
      throw new BadGatewayException('Invalid response from openweathermap');
    }

    let weatherData = null;
    try {
      weatherData = await response.json();
    } catch (err) {
      throw new BadGatewayException('Invalid json from openweathermap');
    }

    try {
      const log = new WeatherRequest({
        lat: String(lat),
        lon: String(lon),
        data: weatherData,
      });

      return await log.save();
    } catch (err) {
      throw new BadRequestException(
        `Can't save. Probably record with lat=${lat} and lon=${lon} already exist in DB. Try another values.`,
      );
    }
  }
}
