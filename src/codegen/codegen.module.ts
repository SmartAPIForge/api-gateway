import { Module } from '@nestjs/common';
import { CodegenService } from './codegen.service';
import { CodegenController } from './codegen.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ChannelCredentials } from '@grpc/grpc-js';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,
    ClientsModule.register([
      {
        name: 'CODEGEN_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'codegen',
          url: process.env.CODEGEN_SERVICE_URL,
          protoPath: 'node_modules/protos/proto/codegen/codegen.proto',
          credentials: ChannelCredentials.createInsecure(),
        },
      },
    ]),
  ],
  controllers: [CodegenController],
  providers: [CodegenService],
  exports: [CodegenService],
})
export class CodegenModule {}
