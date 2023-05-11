import { IsNumber, IsString, Max } from "class-validator";
import { Transform } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class GetPostsDto {
  @ApiProperty()
  @IsString()
    //TODO: max, min
  categoryName: string;

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