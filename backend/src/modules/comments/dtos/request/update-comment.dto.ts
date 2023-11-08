import { IsString, Length, Max, Min } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateCommentDto {
  @ApiProperty({ type: Number, example: 1, minimum: 1, maximum: 255 })
  @IsString()
  @Length(1, 255)
  content: string;
}