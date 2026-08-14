import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UploadsService } from './uploads.service';
import { RequestWithUser } from '../auth/request-with-user-interface';
import { CreateUploadDto } from './entity/create-upload.dto';

@Controller('uploads')
@UseGuards(AuthGuard('jwt'))
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('presign')
  presign(
    @Req() req: RequestWithUser,
    @Body() body: CreateUploadDto,
  ) {
    return this.uploadsService.createPresignedUpload(
      req.user.id,
      body.filename,
      body.contentType,
      body.uploadType,
      body.current_password,
    );
  }
}