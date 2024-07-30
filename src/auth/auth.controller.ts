import {
  Controller,
  Post,
  Body,
  Param,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SignRequestDto } from './dto/sign.request.dto';
import { SignResponseDto } from './dto/sign.response.dto';
import { ResetPasswordWithTokenRequestDto } from './dto/reset-password-with-token.request.dto';
import {
  SignUPAdminRequestDto,
  SignUPClientRequestDto,
} from './dto/signUp.request.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Sign in as admin' })
  @ApiResponse({ status: HttpStatus.OK, type: SignResponseDto })
  @HttpCode(HttpStatus.OK)
  @Post('admin/signin')
  async adminSignIn(
    @Body() signInDto: SignRequestDto,
  ): Promise<SignResponseDto> {
    return this.authService.adminSignIn(signInDto.email, signInDto.password);
  }

  @ApiOperation({ summary: 'Sign up as admin' })
  @ApiResponse({ status: HttpStatus.CREATED, type: SignResponseDto })
  @HttpCode(HttpStatus.CREATED)
  @Post('admin/signup')
  async adminSignUp(
    @Body() signUpDto: SignUPAdminRequestDto,
  ): Promise<SignResponseDto> {
    return this.authService.adminSignUp(
      signUpDto.username,
      signUpDto.email,
      signUpDto.password,
    );
  }

  @ApiOperation({ summary: 'Request password reset for admin' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('admin/reset-password')
  async adminResetPasswordRequest(@Body('email') email: string): Promise<void> {
    return this.authService.adminResetPasswordRequest(email);
  }

  @ApiOperation({ summary: 'Reset admin password' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('admin/reset-password/:token')
  async adminResetPassword(
    @Param('token') token: string,
    @Body() resetPasswordDto: ResetPasswordWithTokenRequestDto,
  ): Promise<void> {
    return this.authService.adminResetPassword(token, resetPasswordDto);
  }

  @ApiOperation({ summary: 'Sign in as user' })
  @ApiResponse({ status: HttpStatus.OK, type: SignResponseDto })
  @HttpCode(HttpStatus.OK)
  @Post('user/signin')
  async userSignIn(
    @Body() signInDto: SignRequestDto,
  ): Promise<SignResponseDto> {
    return this.authService.userSignIn(signInDto.email, signInDto.password);
  }

  @ApiOperation({ summary: 'Sign up as user' })
  @ApiResponse({ status: HttpStatus.CREATED, type: SignResponseDto })
  @HttpCode(HttpStatus.CREATED)
  @Post('user/signup')
  async userSignUp(
    @Body() signUpDto: SignUPClientRequestDto,
  ): Promise<SignResponseDto> {
    return this.authService.userSignUp(
      signUpDto.name,
      signUpDto.surname,
      signUpDto.email,
      signUpDto.password,
    );
  }

  @ApiOperation({ summary: 'Request password reset for user' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('user/reset-password')
  async userResetPasswordRequest(@Body('email') email: string): Promise<void> {
    return this.authService.userResetPasswordRequest(email);
  }

  @ApiOperation({ summary: 'Reset user password' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('user/reset-password/:token')
  async userResetPassword(
    @Param('token') token: string,
    @Body() resetPasswordDto: ResetPasswordWithTokenRequestDto,
  ): Promise<void> {
    return this.authService.userResetPassword(token, resetPasswordDto);
  }
}
