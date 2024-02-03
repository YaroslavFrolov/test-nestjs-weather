import { DataTypes } from 'sequelize';
import { Table, Column, Model } from 'sequelize-typescript';

@Table({
  indexes: [{ fields: ['lat', 'lon'], unique: true }],
})
export class WeatherRequest extends Model {
  @Column({
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  })
  id: number;

  @Column
  lat: string;

  @Column
  lon: string;

  @Column({ type: DataTypes.JSON })
  data: JSON;
}
