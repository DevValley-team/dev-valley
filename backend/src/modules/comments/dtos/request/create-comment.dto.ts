import { IsNumber, IsOptional, IsString, Length } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateCommentDto {
  @ApiPropertyOptional({ type: Number })
  @IsNumber()
  @IsOptional()
  parentId?: number;

  @ApiProperty({ type: Number, example: 1, minimum: 1, maximum: 255 })
  @IsString()
  @Length(1, 255)
  content: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  postId: number;
}