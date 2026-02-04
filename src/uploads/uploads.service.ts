import { Injectable, BadRequestException } from '@nestjs/common';
import { S3Client, PutObjectCommand} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';

@Injectable()
export class UploadsService {
  private s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY!,
      secretAccessKey: process.env.AWS_SECRET_KEY!,
    }
  });

  async createPresignedUpload(filename: string, contentType: string) {
    if (!filename || !contentType) {
      throw new BadRequestException('File name and contentType are required');
    }

    if (!contentType.startsWith('image/')) {
      throw new BadRequestException('Only image uploads are allowed');
    }

    const ext = filename.split('.').pop();
    const key = `uploads/${randomUUID()}.${ext}`;
    const bucket = process.env.S3_BUCKET!;
    const publicBase = process.env.S3_PUBLIC_BASE_URL!;

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(this.s3, command, {
      expiresIn: 60
    });

    return {
      uploadUrl,
      publicUrl: `${publicBase}/${key}`,
      key
    };
  }
}