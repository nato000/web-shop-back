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
import { ResetPasswordResponseDto } from './dto/reset-password.response.dto';
import { ResetPasswordRequestDto } from './dto/reset-password.request.dto';
import { ResetPasswordWithTokenRequestDto } from './dto/reset-password-with-token.request.dto';
import {
  SignUPAdminRequestDto,
  SignUPClientRequestDto,
} from './dto/signUp.request.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Sign in' })
  @ApiResponse({
    status: HttpStatus.OK,
    isArray: true,
    type: SignResponseDto,
    description: 'Access token',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized exception',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Something went wrong',
  })
  @HttpCode(HttpStatus.OK)
  @Post('admin-sign-in')
  public adminSignIn(
    @Body() signInDto: SignRequestDto,
  ): Promise<SignResponseDto> {
    return this.authService.adminSignIn(signInDto.email, signInDto.password);
  }

  @ApiOperation({ summary: 'Sign up' })
  @ApiResponse({
    status: HttpStatus.OK,
    isArray: true,
    type: SignResponseDto,
    description: 'Access token',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Something went wrong',
  })
  @HttpCode(HttpStatus.OK)
  @Post('admin-sign-up')
  public adminSignUp(
    @Body() signUpDto: SignUPAdminRequestDto,
  ): Promise<SignResponseDto> {
    return this.authService.adminSignUp(
      signUpDto.username,
      signUpDto.email,
      signUpDto.password,
    );
  }

  @ApiOperation({ summary: 'Reset password request' })
  @ApiResponse({
    status: HttpStatus.OK,
    isArray: true,
    type: ResetPasswordResponseDto,
    description: 'Reset token',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Something went wrong',
  })
  @HttpCode(HttpStatus.OK)
  @Post('admin-reset-password-request')
  public adminResetPasswordRequest(
    @Body() resetPasswordDto: ResetPasswordRequestDto,
  ): Promise<ResetPasswordResponseDto> {
    return this.authService.adminResetPasswordRequest(resetPasswordDto.email);
  }

  @ApiOperation({ summary: 'Reset password' })
  @ApiResponse({
    status: HttpStatus.OK,
    isArray: true,
    description: 'Reset password',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Something went wrong',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('admin-reset-password/:token')
  public adminResetPassword(
    @Param('token') token: string,
    @Body() resetPasswordDto: ResetPasswordWithTokenRequestDto,
  ): Promise<void> {
    return this.authService.adminResetPassword(token, resetPasswordDto);
  }

  @ApiOperation({ summary: 'Sign in' })
  @ApiResponse({
    status: HttpStatus.OK,
    isArray: true,
    type: SignResponseDto,
    description: 'Access token',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized exception',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Something went wrong',
  })
  @HttpCode(HttpStatus.OK)
  @Post('user-sign-in')
  public userSignIn(
    @Body() signInDto: SignRequestDto,
  ): Promise<SignResponseDto> {
    return this.authService.userSignIn(signInDto.email, signInDto.password);
  }

  @ApiOperation({ summary: 'Sign up' })
  @ApiResponse({
    status: HttpStatus.OK,
    isArray: true,
    type: SignResponseDto,
    description: 'Access token',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Something went wrong',
  })
  @HttpCode(HttpStatus.OK)
  @Post('user-sign-up')
  public userSignUp(
    @Body() signUpDto: SignUPClientRequestDto,
  ): Promise<SignResponseDto> {
    return this.authService.userSignUp(
      signUpDto.name,
      signUpDto.surname,
      signUpDto.email,
      signUpDto.password,
    );
  }
  @ApiOperation({ summary: 'Reset password request' })
  @ApiResponse({
    status: HttpStatus.OK,
    isArray: true,
    type: ResetPasswordResponseDto,
    description: 'Reset token',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Something went wrong',
  })
  @HttpCode(HttpStatus.OK)
  @Post('user-reset-password-request')
  public userResetPasswordRequest(
    @Body() resetPasswordDto: ResetPasswordRequestDto,
  ): Promise<ResetPasswordResponseDto> {
    return this.authService.userResetPasswordRequest(resetPasswordDto.email);
  }

  @ApiOperation({ summary: 'Reset password' })
  @ApiResponse({
    status: HttpStatus.OK,
    isArray: true,
    description: 'Reset password',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Something went wrong',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('user-reset-password/:token')
  public userResetPassword(
    @Param('token') token: string,
    @Body() resetPasswordDto: ResetPasswordWithTokenRequestDto,
  ): Promise<void> {
    return this.authService.userResetPassword(token, resetPasswordDto);
  }
}
