import { IsNumber, IsOptional, Max, Min } from "class-validator";
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
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ type: Number })
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}