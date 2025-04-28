import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import * as dotenv from 'dotenv';

dotenv.config();

import { AuthModule } from './auth/auth.module';
import { DeploymentModule } from './deployment/deployment.module';
import { CodegenModule } from './codegen/codegen.module';
import { ProjectModule } from './project/project.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    AuthModule, 
    UsersModule,
    DeploymentModule, 
    CodegenModule, 
    ProjectModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
