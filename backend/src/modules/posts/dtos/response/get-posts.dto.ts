import { IsNumber, IsOptional, IsString, Max } from "class-validator";
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
  @IsOptional()
  page?: number = 1;

  @ApiProperty()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Max(100)
  @IsOptional()
  limit?: number = 10;
}