import { z } from 'zod';

export const AVAILABLE_PARTS = [
  'current',
  'minutely',
  'hourly',
  'daily',
  'alerts',
] as const; // see openweathermap doc

type Part = (typeof AVAILABLE_PARTS)[number];

export const isValidPart = (value: unknown): boolean => {
  if (typeof value === 'string' && value?.trim().length > 0) {
    const isExistInvalidOption = value
      .split(',')
      .some((p) => !AVAILABLE_PARTS.includes(p as Part));

    return isExistInvalidOption ? false : true;
  }

  return true;
};

export const weatherSchema = z
  .object({
    lat: z.coerce.number(),
    lon: z.coerce.number(),
    part: z
      .string()
      .optional()
      .refine(
        (value) => isValidPart(value),
        (invalidValue) => ({
          message: `The property "part" should be string with subset of "${AVAILABLE_PARTS.join(',')}", but got the "${invalidValue}". Try remove spaces or comma at the end.`,
        }),
      ),
  })
  .required();

export type WeatherDTO = z.infer<typeof weatherSchema>;
