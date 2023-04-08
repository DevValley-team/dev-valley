import { IsNumber, Max } from "class-validator";
import { Transform } from "class-transformer";

export class GetPostsDto {
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  categoryId: number;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  page: number;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Max(100)
  limit: number;
}