import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UploadsService } from './uploads.service';


@Controller('uploads')
@UseGuards(AuthGuard('jwt'))
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('presign')
  presign(
    @Body() body: { filename: string; contentType: string }
  ) {
    return this.uploadsService.createPresignedUpload(
      body.filename,
      body.contentType,
    );
  }
}