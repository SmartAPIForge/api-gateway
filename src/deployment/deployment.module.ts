import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ChannelCredentials } from '@grpc/grpc-js';
import { DeploymentController } from './deployment.controller';
import { DeploymentService } from './deployment.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,
    ClientsModule.register([
      {
        name: 'DEPLOYMENT_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'deployment',
          protoPath: 'node_modules/protos/proto/deployment/deployment.proto',
          url: 'localhost:50057',
          credentials: ChannelCredentials.createInsecure(),
        },
      },
    ]),
  ],
  controllers: [DeploymentController],
  providers: [DeploymentService],
})
export class DeploymentModule {}
