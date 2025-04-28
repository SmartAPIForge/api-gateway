import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../auth/dto/validateHeaderDto';

export class GetAllProjectsRequestDto {
  @ApiProperty({ required: false, description: 'Page number', default: '1' })
  page?: string;

  @ApiProperty({ required: false, description: 'Items per page', default: '10' })
  limit?: string;
}

export class GetFilteredProjectsRequestDto {
  @ApiProperty({ required: false, description: 'Page number', default: '1' })
  page?: string;

  @ApiProperty({ required: false, description: 'Items per page', default: '10' })
  limit?: string;

  @ApiProperty({ required: false, description: 'Project owner' })
  owner?: string;

  @ApiProperty({ required: false, description: 'Project status' })
  status?: string;

  @ApiProperty({ required: false, description: 'Project name prefix' })
  namePrefix?: string;
}

export class ProjectResponseDto {
  @ApiProperty({ description: 'Project name' })
  name: string;

  @ApiProperty({ description: 'Project owner' })
  owner: string;

  @ApiProperty({ description: 'Project status' })
  status: string;

  @ApiProperty({ description: 'Project creation date' })
  createdAt: string;

  @ApiProperty({ description: 'Project last update date' })
  updatedAt: string;
}

export class ProjectsListResponseDto {
  @ApiProperty({ type: [ProjectResponseDto], description: 'List of projects' })
  projects: ProjectResponseDto[];

  @ApiProperty({ description: 'Total count of projects' })
  total: number;
}

export class DeleteProjectResponseDto {
  @ApiProperty({ description: 'Deletion status' })
  success: boolean;

  @ApiProperty({ description: 'Deletion message', required: false })
  message?: string;
}

export class InitProjectRequestDto {
  @ApiProperty({ description: 'Project name', required: true })
  name: string;
}

export class UpdateProjectRequestDto {
  @ApiProperty({ description: 'Project name', required: true })
  name: string;

  @ApiProperty({ description: 'Project data', required: true })
  data: string;
} 