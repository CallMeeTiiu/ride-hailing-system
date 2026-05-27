import { Controller, Get, Param, Res } from '@nestjs/common'
import { join } from 'path'
import type { Response } from 'express'

@Controller('uploads')
export class UploadsController {
  @Get(':filename')
  async getFile(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = join(process.cwd(), 'uploads', filename)
    return res.sendFile(filePath)
  }
}
