import { IsNumber, IsString, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateCategoryDto {
  @ApiProperty({ type: Number })
  @IsNumber()
  id: number;

  @ApiProperty({ type: String, minimum: 1, maximum: 20})
  @IsString()
  @Length(1, 20)
  name: string;
}