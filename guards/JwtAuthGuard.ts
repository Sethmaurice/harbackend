import { Injectable } from '@nestjs/common';
import { AuthService } from 'service/AuthService'; // Make sure to import your AuthService correctly
import { ExecutionContext, CanActivate } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1]; // Extract token from header

    if (!token) {
      throw new Error('Unauthorized'); // Throw error if token is not provided
    }

    try {
      // Validate the token and get the user information
      const user = await this.authService.validateToken(token); // Assumes validateToken returns user data if the token is valid

      if (!user) {
        throw new Error('Unauthorized'); // If the token is invalid and user is null
      }

      // Attach the user data to the request object
      request.user = user;
      return true;
    } catch (error) {
      // If the token is invalid or any error occurs during validation
      throw new Error('Unauthorized');
    }
  }
}
