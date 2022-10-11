import { Module } from '@nestjs/common';
import { Services } from '../utils/constants';
import { S3 } from '@aws-sdk/client-s3';
import { ImageStorageService } from './image-storage.service';

@Module({
  providers: [
    {
      provide: Services.SPACES_CLIENT,
      useValue: new S3({
        credentials: {
          accessKeyId: 'DO004X8H96PPW6ATALY9',
          secretAccessKey: '1EvCtLYMFJCbKBSo4qSdc1l+Y+WYcUEebxgpSmwnzyI',
        },
        endpoint: 'https://sfo3.digitaloceanspaces.com',
        region: 'sfo3',
      }),
    },
    {
      provide: Services.IMAGE_UPLOAD_SERVICE,
      useClass: ImageStorageService,
    },
  ],
  exports: [
    {
      provide: Services.SPACES_CLIENT,
      useValue: new S3({
        credentials: {
          accessKeyId: 'DO004X8H96PPW6ATALY9',
          secretAccessKey: '1EvCtLYMFJCbKBSo4qSdc1l+Y+WYcUEebxgpSmwnzyI',
        },
        endpoint: 'https://sfo3.digitaloceanspaces.com',
        region: 'sfo3',
      }),
    },
    {
      provide: Services.IMAGE_UPLOAD_SERVICE,
      useClass: ImageStorageService,
    },
  ],
})
export class ImageStorageModule {}
