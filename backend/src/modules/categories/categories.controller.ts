import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
} from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { CreateCategoryDto } from "./dtos/request/create-category.dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Serialize } from "../../common/interceptors/serialize.interceptor";
import { Public } from "../../common/decorators/public.decorator";
import { CategoryResponseDto } from "./dtos/response/category-response.dto";

@ApiTags('카테고리')
@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @ApiOperation({ summary: '카테고리 생성' })
  @ApiResponse({ status: HttpStatus.CREATED, type: CategoryResponseDto })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Serialize(CategoryResponseDto)
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoriesService.create(createCategoryDto);
  }

  @ApiOperation({ summary: '카테고리 삭제' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.categoriesService.remove(id);
  }

  @Public()
  @Get()
  async findAll() {

  }
}
