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
import { ResetTokenInterface } from 'src/reset-token/interfaces/reset-token.interface';
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

  async adminSignIn(email: string, pass: string): Promise<any> {
    const user = await this.adminService.findByEmail(email);

    if (!(await isPasswordCorrect(pass, user.password))) {
      throw new UnauthorizedException('Password incorrect');
    }

    const payload = {
      id: user.id,
      email: user.email,
      roles: user.roles, // Include roles in the payload
    };

    console.log('SignIn Payload:', payload);
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
      username: username,
      email: email,
      password: pass,
      roles: [Role.Admin], // Set default role
    });
    const payload = {
      id: newUser.id,
      email: newUser.email,
      roles: newUser.roles,
    };
    console.log('SignUp Payload:', payload);
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  public async adminResetPasswordRequest(
    email: string,
  ): Promise<ResetTokenInterface> {
    const user = await this.adminService.findByEmail(email);
    if (!user) {
      throw new BadRequestException(
        `Cannot generate token for reset password request  because user with email:${email} is not found`,
      );
    }
    const token = await this.resetTokenService.generateResetToken(email);

    // await this.mailerService.sendEmail(email, 'password reset', token.token);

    return;
  }

  public async adminResetPassword(
    token: string,
    resetPasswordWithTokenRequestDto: ResetPasswordWithTokenRequestDto,
  ): Promise<void> {
    const { newPassword } = resetPasswordWithTokenRequestDto;
    const resetPasswordRequest =
      await this.resetTokenService.getResetToken(token);
    if (!resetPasswordRequest) {
      throw new BadRequestException(`There is no request password request`);
    }
    const user = await this.adminService.findByEmail(
      resetPasswordRequest.email,
    );
    if (!user) {
      throw new BadRequestException(`user is not found`);
    }

    await this.adminService.updateAdminPasswordById(user.id, newPassword);
    await this.resetTokenService.removeResetToken(token);
  }

  async userSignIn(email: string, pass: string): Promise<any> {
    const user = await this.clientService.findByEmail(email);

    if (!(await isPasswordCorrect(pass, user.password))) {
      throw new UnauthorizedException('Password incorrect');
    }

    const payload = {
      id: user.id,
      email: user.email,
      roles: user.roles, // Include roles in the payload
    };

    console.log('SignIn Payload:', payload);
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
      name: name,
      surname: surname,
      email: email,
      password: pass,
      roles: [Role.User], // Set default role
    });
    const payload = {
      id: newUser.id,
      email: newUser.email,
      roles: newUser.roles,
    };
    console.log('SignUp Payload:', payload);
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  public async userResetPasswordRequest(
    email: string,
  ): Promise<ResetTokenInterface> {
    const user = await this.clientService.findByEmail(email);
    if (!user) {
      throw new BadRequestException(
        `Cannot generate token for reset password request  because user with email:${email} is not found`,
      );
    }
    const token = await this.resetTokenService.generateResetToken(email);

    // await this.mailerService.sendEmail(email, 'password reset', token.token);

    return;
  }

  public async userResetPassword(
    token: string,
    resetPasswordWithTokenRequestDto: ResetPasswordWithTokenRequestDto,
  ): Promise<void> {
    const { newPassword } = resetPasswordWithTokenRequestDto;
    const resetPasswordRequest =
      await this.resetTokenService.getResetToken(token);
    if (!resetPasswordRequest) {
      throw new BadRequestException(`There is no request password request`);
    }
    const user = await this.clientService.findByEmail(
      resetPasswordRequest.email,
    );
    if (!user) {
      throw new BadRequestException(`user is not found`);
    }

    await this.clientService.updateClientPasswordById(user.id, newPassword);
    await this.resetTokenService.removeResetToken(token);
  }
}
