import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DeploymentModule } from './deployment/deployment.module';

@Module({
  imports: [AuthModule, DeploymentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
