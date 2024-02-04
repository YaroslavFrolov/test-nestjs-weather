import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppService } from './app.service';
import { WeatherModule } from './weather/weather.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRoot({
      dialect: 'postgres',

      host: 'db', // localhost
      // port: Number(process.env.DB_PORT),
      port: 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,

      autoLoadModels: true,
      synchronize: true,
    }),
    WeatherModule,
  ],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}
