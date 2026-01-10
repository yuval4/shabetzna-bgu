import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { GoogleAuthGuard } from './guards/google.guard';
import { Development, Public } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Development()
  @Post('login')
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() loginDto: LoginDto,
  ) {
    const token = await this.authService.signIn(loginDto.id);

    // res.cookie(TOKEN_KEY, token, {
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: 'none',
    //   expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
    // });

    return token;
  }

  @Public()
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    // res.clearCookie(TOKEN_KEY, {
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: 'none',
    // });
  }

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  googleLogin() {}

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleCallback(@Req() req, @Res() res) {
    console.log(
      'function: googleCallback ---> ',
      'User from Google callback:',
      req.user,
    );

    const token = await this.authService.signIn(req.user.id);
    console.log(
      'function: googleCallback ---> ',
      'Redirecting to client with token',
    );

    res.redirect(`${process.env.CLIENT_URL}/login?token=${token}`);
  }
}
