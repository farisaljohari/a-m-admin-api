import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { AddProjectDto, AddProjectImageDto, UpdateProjectDto } from '../dtos';
import {
  ProjectImageRepository,
  ProjectRepository,
} from '@app/common/modules/project/repositories/project.repository';

@Injectable()
export class ProjectService {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly projectImageRepository: ProjectImageRepository,
  ) {}
  async getAllProjects() {
    try {
      const projects = await this.projectRepository.find({
        relations: ['images'],
      });

      return projects;
    } catch (err) {
      if (err instanceof BadRequestException) {
        throw err; // Re-throw BadRequestException
      } else {
        throw new HttpException('projects not found', HttpStatus.NOT_FOUND);
      }
    }
  }
  async addProject(addProjectDto: AddProjectDto) {
    try {
      const project = await this.projectRepository.save({
        title: addProjectDto.title,
        location: addProjectDto.location,
      });
      if (project.uuid) {
        for (const image of addProjectDto.images) {
          await this.projectImageRepository.save({
            image,
            project: {
              uuid: project.uuid,
              image: image,
            },
          });
        }
      }
      return project;
    } catch (error) {
      throw new HttpException(
        error.message || 'Error While Adding project',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async deleteProjectImage(imageUuid: string) {
    try {
      const picture = await this.projectImageRepository.delete({
        uuid: imageUuid,
      });

      return picture;
    } catch (err) {
      if (err instanceof BadRequestException) {
        throw err; // Re-throw BadRequestException
      } else {
        throw new HttpException('image not found', HttpStatus.NOT_FOUND);
      }
    }
  }
  async deleteProject(projectUuid: string) {
    try {
      const project = await this.projectRepository.delete({
        uuid: projectUuid,
      });

      return project;
    } catch (err) {
      if (err instanceof BadRequestException) {
        throw err; // Re-throw BadRequestException
      } else {
        throw new HttpException('project not found', HttpStatus.NOT_FOUND);
      }
    }
  }
  async addProjectImage(
    projectUuid: string,
    addProjectImageDto: AddProjectImageDto,
  ) {
    try {
      const savedImages = []; // Collect saved images to return

      for (const image of addProjectImageDto.images) {
        // Save each image to the repository
        const savedImage = await this.projectImageRepository.save({
          image,
          project: {
            uuid: projectUuid,
          },
        });
        savedImages.push(savedImage); // Add the saved image to the collection
      }

      return savedImages; // Return all saved images
    } catch (err) {
      if (err instanceof BadRequestException) {
        throw err; // Re-throw BadRequestException
      } else {
        // Log the error for debugging
        console.error('Error saving project images:', err);
        throw new HttpException(
          'Failed to save images',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
  async getProjectByUuid(projectUuid: string) {
    try {
      const project = await this.projectRepository.findOne({
        where: { uuid: projectUuid },
        relations: ['images'],
      });

      return project;
    } catch (err) {
      if (err instanceof BadRequestException) {
        throw err; // Re-throw BadRequestException
      } else {
        throw new HttpException('project not found', HttpStatus.NOT_FOUND);
      }
    }
  }
  async updateProject(projectUuid: string, updateProjectDto: UpdateProjectDto) {
    try {
      const pictures = await this.projectRepository.update(
        { uuid: projectUuid },
        {
          title: updateProjectDto.title,
          location: updateProjectDto.location,
        },
      );

      return pictures;
    } catch (error) {
      throw new HttpException(
        error.message || 'Error While Updating Project',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
