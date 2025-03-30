import { Inject, Injectable } from '@nestjs/common';
import {
  CodegenServiceClient,
  SafRequest,
  TrackDTO,
  GenerationStatusResponse,
} from 'protos/gen/ts/codegen/codegen';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class CodegenService {
  private codegenClient: CodegenServiceClient;

  constructor(@Inject('CODEGEN_PACKAGE') private client: ClientGrpc) {
    this.codegenClient =
      this.client.getService<CodegenServiceClient>('CodegenService');
  }

  generate(request: SafRequest): Promise<TrackDTO> {
    const generated = this.codegenClient.generate(request);
    return lastValueFrom(generated);
  }

  track(request: TrackDTO): Promise<GenerationStatusResponse> {
    const tracked = this.codegenClient.track(request);
    return lastValueFrom(tracked);
  }
}
