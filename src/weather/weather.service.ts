import {
  Injectable,
  BadRequestException,
  ServiceUnavailableException,
  BadGatewayException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import fetch from 'node-fetch';
import { WeatherRequest } from './weather-request.model';
import { WeatherDTO } from './weather.dto';

@Injectable()
export class WeatherService {
  constructor(
    @InjectModel(WeatherRequest)
    private weatherRequestModel: typeof WeatherRequest,
  ) {}

  async getDataFromStorage(payload: WeatherDTO): Promise<unknown> {
    const record = await this.weatherRequestModel.findOne({
      where: {
        [Op.and]: {
          lat: String(payload.lat),
          lon: String(payload.lon),
        },
      },
      raw: true,
    });

    if (!record) throw new NotFoundException();

    return record;
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

    let weatherData = null;
    try {
      weatherData = await response.json();
    } catch (err) {
      throw new BadGatewayException('Invalid json from openweathermap');
    }

    if (!response.ok) {
      if (weatherData.message) {
        throw new BadGatewayException(`Openweathermap: ${weatherData.message}`);
      } else {
        throw new BadGatewayException('Invalid response from openweathermap');
      }
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
