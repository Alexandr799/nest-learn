import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { path } from 'app-root-path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: `${path}/upload`,
      serveRoot: '/static'
    })
  ],
  controllers: [FileController],
  providers: [FileService]
})
export class FileModule {}
