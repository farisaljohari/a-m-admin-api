import { Column, Entity, OneToMany, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../../abstract/entities/abstract.entity';
import { ProjectDto, ProjectImagesDto } from '../dtos/project.dto';

@Entity({ name: 'project' })
export class ProjectEntity extends AbstractEntity<ProjectDto> {
  @Column({
    type: 'uuid',
    default: () => 'gen_random_uuid()',
    nullable: false,
  })
  public uuid: string;

  @Column({
    nullable: false,
  })
  title: string;

  @Column({
    nullable: false,
  })
  public location: string;

  // Define the one-to-many relationship
  @OneToMany(
    () => ProjectImagesEntity,
    (projectImage) => projectImage.project,
    {
      cascade: true, // Optional: allows cascading operations
    },
  )
  public images: ProjectImagesEntity[];

  constructor(partial: Partial<ProjectEntity>) {
    super();
    Object.assign(this, partial);
  }
}

@Entity({ name: 'project-image' })
export class ProjectImagesEntity extends AbstractEntity<ProjectImagesDto> {
  @Column({
    type: 'uuid',
    default: () => 'gen_random_uuid()',
    nullable: false,
  })
  public uuid: string;

  @Column({
    nullable: false,
  })
  image: string;

  // Define the many-to-one relationship
  @ManyToOne(() => ProjectEntity, (project) => project.images, {
    nullable: false,
    onDelete: 'CASCADE', // Optional: specify behavior on deletion of the project
  })
  public project: ProjectEntity;

  constructor(partial: Partial<ProjectImagesEntity>) {
    super();
    Object.assign(this, partial);
  }
}
