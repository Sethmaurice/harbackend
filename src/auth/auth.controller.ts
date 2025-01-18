import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from 'service/AuthService'; // Ensure the path is correct

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body('email') email: string, @Body('password') password: string) {
    return this.authService.register(email, password);
  }

  @Post('login')
async login(@Body('email') email: string, @Body('password') password: string) {
  const response = await this.authService.login(email, password);

  // Log the entire response object to ensure userId is present
  console.log('Login Response:', response); // Should log both accessToken and userId

  return response;
}

}
