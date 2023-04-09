import { IsNumber, IsOptional, Max } from "class-validator";
import { Transform } from "class-transformer";

export class GetCommentsDto {
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  postId: number;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  page: number = 1;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  @Max(20)
  limit: number = 10;
}