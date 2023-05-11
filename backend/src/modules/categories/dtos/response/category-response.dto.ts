import { Expose } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class CategoryResponseDto {
  @ApiProperty({ type: String })
  @Expose()
  name: string;
}