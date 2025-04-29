import { ApiProperty } from '@nestjs/swagger';

export class ServerPreviewDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: '192.168.1.1' })
  ip: string;

  @ApiProperty({ example: 22 })
  port: number;

  @ApiProperty({ example: 'admin' })
  user: string;
}

export class AddServerRequestDto {
  @ApiProperty({ example: '192.168.1.1' })
  ip: string;

  @ApiProperty({ example: 22 })
  port: number;

  @ApiProperty({ example: 'admin' })
  user: string;

  @ApiProperty({ example: 'password' })
  password: string;
}

export class ListServersRequestDto {}

export class RemoveServerRequestDto {
  @ApiProperty({ example: 1 })
  id: number;
}

export class RemoveServerResponseDto {
  @ApiProperty({ example: true })
  status: boolean;
}

export class ListServersResponseDto {
  @ApiProperty({ type: [ServerPreviewDto] })
  servers: ServerPreviewDto[];
}

export class AddServerResponseDto {
  @ApiProperty({ type: ServerPreviewDto, nullable: true })
  server: ServerPreviewDto | undefined;
}

export class GetDeploymentRequestDto {
  @ApiProperty({ description: 'Deployment ID' })
  id: string;
}

export class DeploymentDto {
  @ApiProperty({ description: 'Deployment ID' })
  id: string;

  @ApiProperty({ description: 'Deployment owner' })
  owner: string;

  @ApiProperty({ description: 'Deployment name' })
  name: string;

  @ApiProperty({ description: 'Deployment URL' })
  url: string;

  @ApiProperty({ description: 'Deployment status' })
  status: string;

  @ApiProperty({ description: 'Start time' })
  startTime: Date;

  @ApiProperty({ description: 'End time' })
  endTime: Date;

  @ApiProperty({ description: 'Duration in seconds' })
  durationSeconds: number;

  @ApiProperty({ description: 'Server ID' })
  serverId: number;

  @ApiProperty({ description: 'Container ID' })
  containerId: string;
}

export class GetDeploymentResponseDto {
  @ApiProperty({ description: 'Deployment details' })
  deployment: DeploymentDto;
}

export class ListDeploymentsRequestDto {
  @ApiProperty({ description: 'Optional filter by owner', required: false })
  owner?: string;
}

export class ListDeploymentsResponseDto {
  @ApiProperty({ description: 'List of deployments', type: [DeploymentDto] })
  deployments: DeploymentDto[];
}

export class DeleteDeploymentRequestDto {
  @ApiProperty({ description: 'Deployment ID' })
  id: string;
}

export class DeleteDeploymentResponseDto {
  @ApiProperty({ description: 'Success status' })
  success: boolean;
}

export class StartDeploymentRequestDto {
  @ApiProperty({ description: 'Deployment ID' })
  id: string;
}

export class StartDeploymentResponseDto {
  @ApiProperty({ description: 'Updated deployment details' })
  deployment: DeploymentDto;
}

export class StopDeploymentRequestDto {
  @ApiProperty({ description: 'Deployment ID' })
  id: string;
}

export class StopDeploymentResponseDto {
  @ApiProperty({ description: 'Updated deployment details' })
  deployment: DeploymentDto;
}
