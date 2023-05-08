import { IsString, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCategoryDto {
  @ApiProperty({ type: String, minimum: 1, maximum: 20 })
  @IsString()
  @Length(1, 20)
  name: string;
}