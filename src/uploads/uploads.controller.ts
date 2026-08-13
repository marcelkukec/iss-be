import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UploadsService } from './uploads.service';
import { RequestWithUser } from '../auth/request-with-user-interface';

@Controller('uploads')
@UseGuards(AuthGuard('jwt'))
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('presign')
  presign(
    @Req() req: RequestWithUser,
    @Body() body: {
      filename: string;
      contentType: string;
      current_password: string;
    }
  ) {
    return this.uploadsService.createPresignedUpload(
      req.user.id,
      body.filename,
      body.contentType,
      body.current_password,
    );
  }
}