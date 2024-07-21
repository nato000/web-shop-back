import { Injectable, Logger } from '@nestjs/common';
import crypto from 'crypto';

import { ResetTokenInterface } from './interfaces/reset-token.interface';

@Injectable()
export class ResetTokenService {
  private logger: Logger;
  constructor() {
    this.logger = new Logger(ResetTokenService.name);
  }
  private tokens = [];

  public async generateResetToken(email: string): Promise<ResetTokenInterface> {
    const token = crypto.randomBytes(32).toString('hex');
    const resetPasswordObject = {
      email,
      token,
    };
    this.tokens.push(resetPasswordObject);
    return resetPasswordObject;
  }

  public async getResetToken(token: string): Promise<ResetTokenInterface> {
    const currToken = this.tokens.find((el) => el.token === token);
    return currToken;
  }

  public async removeResetToken(token: string): Promise<void> {
    this.tokens = this.tokens.filter((el) => el.token === token);
  }
}
