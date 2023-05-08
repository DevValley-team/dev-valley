import { IsNumber, IsOptional, Max } from "class-validator";
import { Transform } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class GetCommentsDto {
  @ApiProperty({ type: Number })
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  postId: number;

  @ApiPropertyOptional({ type: Number })
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ type: Number })
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  @Max(20)
  limit?: number = 10;
}