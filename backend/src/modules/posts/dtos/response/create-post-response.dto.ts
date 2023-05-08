import { Expose } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class CreatePostResponseDto {
  @ApiProperty({ type: Number })
  @Expose()
  id: number;
}