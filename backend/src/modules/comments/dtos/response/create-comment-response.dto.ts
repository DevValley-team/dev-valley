import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class CreateCommentResponseDto {
  @ApiProperty({ type: Number })
  @Expose()
  id: number;
}