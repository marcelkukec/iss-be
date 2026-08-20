import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { S3Client, PutObjectCommand} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';
import { UserService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

export type UploadType = 'avatars' | 'posts';

@Injectable()
export class UploadsService {
  private s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY!,
      secretAccessKey: process.env.AWS_SECRET_KEY!,
    }
  });

  constructor(
    private readonly userService: UserService,
  ) {}

  async createPresignedUpload(
    userId: number,
    filename: string,
    contentType: string,
    uploadType: UploadType,
    currentPassword?: string) {

    if (uploadType === 'avatars') {
      if (!currentPassword) {
        throw new ForbiddenException("Current password is required.");
      }

      const user = await this.userService.findById(userId);

      const passwordMatches = await bcrypt.compare(currentPassword, user.password);

      if (!passwordMatches) {
        throw new ForbiddenException('Invalid password');
      }
    }

    const allowedTypes: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
    };

    const ext = allowedTypes[contentType];

    if (!ext) {
      throw new BadRequestException('Only JPEG and PNG images are allowed');
    }

    const bucket = process.env.S3_BUCKET;
    const publicBase = process.env.S3_PUBLIC_BASE_URL;

    if (!bucket || !publicBase) {
      throw new Error('S3 configuration missing');
    }

    const key = `uploads/${uploadType}/${randomUUID()}.${ext}`;

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(this.s3, command, {
      expiresIn: 60,
    });

    return {
      uploadUrl,
      publicUrl: `${publicBase}/${key}`,
      key,
    }
  }
}