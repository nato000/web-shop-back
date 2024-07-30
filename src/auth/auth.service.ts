import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from 'src/admin/admin.service';
import { ResetTokenService } from 'src/reset-token/reset-token.service';
import { isPasswordCorrect } from 'src/utils/password-hash';
import { SignResponseDto } from './dto/sign.response.dto';
import { ResetPasswordWithTokenRequestDto } from './dto/reset-password-with-token.request.dto';
import { Role } from 'src/roles/enums/role.enum';
import { ClientService } from 'src/client/client.service';

@Injectable()
export class AuthService {
  constructor(
    private adminService: AdminService,
    private clientService: ClientService,
    private jwtService: JwtService,
    private resetTokenService: ResetTokenService,
  ) {}

  async adminSignIn(email: string, pass: string): Promise<SignResponseDto> {
    const user = await this.adminService.findByEmail(email);
    if (!user || !(await isPasswordCorrect(pass, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { id: user.id, email: user.email, roles: user.roles };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  public async adminSignUp(
    username: string,
    email: string,
    pass: string,
  ): Promise<SignResponseDto> {
    const newUser = await this.adminService.createAdminUser({
      username,
      email,
      password: pass,
      roles: [Role.Admin],
    });
    const payload = {
      id: newUser.id,
      email: newUser.email,
      roles: newUser.roles,
    };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  public async adminResetPasswordRequest(email: string): Promise<void> {
    const user = await this.adminService.findByEmail(email);
    if (!user) {
      throw new BadRequestException(`User with email ${email} not found`);
    }
    const token = await this.resetTokenService.generateResetToken(email);
    // await this.mailerService.sendEmail(email, 'Password Reset', token.token);
  }

  public async adminResetPassword(
    token: string,
    resetPasswordDto: ResetPasswordWithTokenRequestDto,
  ): Promise<void> {
    const { newPassword } = resetPasswordDto;
    const resetRequest = await this.resetTokenService.getResetToken(token);
    if (!resetRequest) {
      throw new BadRequestException('Invalid or expired reset token');
    }
    const user = await this.adminService.findByEmail(resetRequest.email);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    await this.adminService.updateAdminPasswordById(user.id, newPassword);
    await this.resetTokenService.removeResetToken(token);
  }

  async userSignIn(email: string, pass: string): Promise<SignResponseDto> {
    const user = await this.clientService.findByEmail(email);
    if (!user || !(await isPasswordCorrect(pass, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { id: user.id, email: user.email, roles: user.roles };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  public async userSignUp(
    name: string,
    surname: string,
    email: string,
    pass: string,
  ): Promise<SignResponseDto> {
    const newUser = await this.clientService.createClient({
      name,
      surname,
      email,
      password: pass,
      roles: [Role.User],
    });
    const payload = {
      id: newUser.id,
      email: newUser.email,
      roles: newUser.roles,
    };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  public async userResetPasswordRequest(email: string): Promise<void> {
    const user = await this.clientService.findByEmail(email);
    if (!user) {
      throw new BadRequestException(`User with email ${email} not found`);
    }
    const token = await this.resetTokenService.generateResetToken(email);
    // await this.mailerService.sendEmail(email, 'Password Reset', token.token);
  }

  public async userResetPassword(
    token: string,
    resetPasswordDto: ResetPasswordWithTokenRequestDto,
  ): Promise<void> {
    const { newPassword } = resetPasswordDto;
    const resetRequest = await this.resetTokenService.getResetToken(token);
    if (!resetRequest) {
      throw new BadRequestException('Invalid or expired reset token');
    }
    const user = await this.clientService.findByEmail(resetRequest.email);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    await this.clientService.updateClientPasswordById(user.id, newPassword);
    await this.resetTokenService.removeResetToken(token);
  }
}
