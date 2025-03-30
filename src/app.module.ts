import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DeploymentModule } from './deployment/deployment.module';
import { CodegenModule } from './codegen/codegen.module';
import { ProjectModule } from './project/project.module';

@Module({
  imports: [AuthModule, DeploymentModule, CodegenModule, ProjectModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
