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
