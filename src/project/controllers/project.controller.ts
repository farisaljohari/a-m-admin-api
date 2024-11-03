import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  // UseGuards,
} from '@nestjs/common';
import { ProjectService } from '../services/project.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
// import { JwtAuthGuard } from '../../../libs/common/src/guards/jwt.auth.guard';
import { EnableDisableStatusEnum } from '@app/common/constants/days.enum';
import { AddProjectDto, AddProjectImageDto, UpdateProjectDto } from '../dtos';

@ApiTags('Project Module')
@Controller({
  version: EnableDisableStatusEnum.ENABLED,
  path: 'project',
})
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  @Post('')
  async addProject(@Body() addProjectDto: AddProjectDto) {
    const project = await this.projectService.addProject(addProjectDto);

    return {
      statusCode: HttpStatus.CREATED,
      success: true,
      message: 'Project added successfully',
      data: project,
    };
  }
  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  @Get()
  async getAllProjects() {
    return await this.projectService.getAllProjects();
  }
  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  @Delete('image/:imageUuid')
  async deleteProjectImage(@Param('imageUuid') imageUuid: string) {
    await this.projectService.deleteProjectImage(imageUuid);
    return {
      statusCode: HttpStatus.OK,
      message: 'image deleted Successfully',
    };
  }
  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  @Delete('/:projectUuid')
  async deleteProject(@Param('projectUuid') projectUuid: string) {
    await this.projectService.deleteProject(projectUuid);
    return {
      statusCode: HttpStatus.OK,
      message: 'Project deleted Successfully',
    };
  }
  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  @Post('image/:projectUuid')
  async addProjectImage(
    @Param('projectUuid') projectUuid: string,
    @Body() addProjectImageDto: AddProjectImageDto,
  ) {
    await this.projectService.addProjectImage(projectUuid, addProjectImageDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'image project added Successfully',
    };
  }
  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  @Get(':projectUuid')
  async getProjectByUuid(@Param('projectUuid') projectUuid: string) {
    return await this.projectService.getProjectByUuid(projectUuid);
  }
  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  @Put(':projectUuid')
  async updateProject(
    @Param('projectUuid') projectUuid: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    const picture = await this.projectService.updateProject(
      projectUuid,
      updateProjectDto,
    );

    return {
      statusCode: HttpStatus.CREATED,
      success: true,
      message: 'project updated successfully',
      data: picture,
    };
  }
}
