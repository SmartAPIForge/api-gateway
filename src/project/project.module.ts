import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ChannelCredentials } from '@grpc/grpc-js';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { AuthModule } from '../auth/auth.module';
import { CodegenModule } from "../codegen/codegen.module";
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ClientsModule.register([
      {
        name: 'PROJECT_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'project',
          protoPath: 'node_modules/protos/proto/project/project.proto',
          url: process.env.PROJECT_SERVICE_URL,
          credentials: ChannelCredentials.createInsecure(),
        },
      },
    ]),
    CodegenModule,
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
