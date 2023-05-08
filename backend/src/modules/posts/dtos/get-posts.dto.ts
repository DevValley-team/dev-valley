import { IsNumber, Max } from "class-validator";
import { Transform } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class GetPostsDto {
  @ApiProperty()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  categoryId: number;

  @ApiProperty()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  page: number;

  @ApiProperty()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Max(100)
  limit: number;
}