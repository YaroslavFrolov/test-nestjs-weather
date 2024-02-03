import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response {
  sunrise?: number;
  sunset?: number;
  temp?: number;
  feels_like?: number;
  pressure?: number;
  humidity?: number;
  uvi?: number;
  wind_speed?: number;
}

@Injectable()
export class WeatherGetInterceptor<T> implements NestInterceptor<T, Response> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response> {
    return next.handle().pipe(
      map((response) => {
        return {
          sunrise: response?.data?.sys?.sunrise,
          sunset: response?.data?.sys?.sunset,
          temp: response?.data?.main?.temp,
          feels_like: response?.data?.main?.feels_like,
          pressure: response?.data?.main?.pressure,
          humidity: response?.data?.main?.humidity,
          uvi: undefined, // field does not exist in response of https://api.openweathermap.org/data/2.5/weather
          wind_speed: response?.data?.wind?.speed,
        };
      }),
    );
  }
}
