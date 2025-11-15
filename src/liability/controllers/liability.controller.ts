import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Req,
  Param,
  Get,
  Patch,
  Delete,
} from '@nestjs/common';
import { CreateLiabilityDto } from '../dto/create-liability.dto';
import { LiabilityService } from '../services/liability.service';
import { UserRole } from 'src/user/interfaces/user-role.enum';
import { Roles } from 'src/auth/decorators/role.decorator';
import type { RequestWithUser } from 'src/auth/types/request-with-user.interface';
import { Liability } from '../entities/liability.entity';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UpdateLiabilityDto } from '../dto/update-liability.dto';

@Controller('liability')
@ApiBearerAuth()
export class LiabilityController {
  constructor(private readonly liabilityService: LiabilityService) {}

  @Post()
  @Roles(UserRole.OFFICER)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createLiabilityDto: CreateLiabilityDto,
    @Req() req: RequestWithUser,
  ): Promise<any> {
    const issuerId = req.user.userId;

    const liability = (await this.liabilityService.createLiability(
      createLiabilityDto,
      Number(issuerId),
    )) as Liability;

    return {
      message: 'Liability created successfully',
      liability,
    };
  }

  @Get(':id')
  @Roles(UserRole.OFFICER, UserRole.ADMIN)
  async findOne(@Param('id') id: string): Promise<{
    message: string;
    liability: Liability;
  }> {
    const liability = await this.liabilityService.findLiabilityById(Number(id));

    return {
      message: 'Liability retrieved successfully',
      liability,
    };
  }

  @Patch(':id')
  @Roles(UserRole.OFFICER, UserRole.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateLiabilityDto: UpdateLiabilityDto,
  ): Promise<{ message: string; liability: Liability }> {
    const updatedLiability = await this.liabilityService.updateLiability(
      Number(id),
      updateLiabilityDto,
    );

    return {
      message: 'Liability updated successfully',
      liability: updatedLiability,
    };
  }

  @Delete(':id')
  @Roles(UserRole.OFFICER, UserRole.ADMIN)
  async remove(@Param('id') id: string): Promise<{
    message: string;
    liability: Liability;
  }> {
    const cancelledLiability = await this.liabilityService.cancelLiability(Number(id));

    return {
      message: 'Liability cancelled (soft deleted) successfully',
      liability: cancelledLiability,
    };
  }
}