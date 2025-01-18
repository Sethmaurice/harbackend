import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'Entities/User/User'; // Ensure the path is correct
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt'; // Ensure JwtService is imported

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>, // Inject the User repository
    private jwtService: JwtService, // Inject JwtService to generate the token
  ) {}

  async register(email: string, password: string): Promise<User> {
    // Check if the user already exists in the database
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('User already exists');
    }
    
    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create and save the new user
    const newUser = this.userRepository.create({ email, password: hashedPassword });
    return await this.userRepository.save(newUser);
  }
  
  async login(email: string, password: string): Promise<{ accessToken: string, userId: number, role: string }> {
    const user = await this.userRepository.findOne({ where: { email } });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }
  
    const payload = { email: user.email, sub: user.id, role: user.role }; // Include role in payload
    const accessToken = this.jwtService.sign(payload);
  
    // Log the response object before returning
    console.log('Login response:', { accessToken, userId: user.id, role: user.role });
  
    return { accessToken, userId: user.id, role: user.role }; // Return role with response
  }
  
  
   // This method will validate the token and return the user info (such as role, id, etc.)
   async validateToken(token: string): Promise<any> {
    try {
      const decoded = this.jwtService.verify(token); // Verify the token using the JwtService
      return decoded; // Return the decoded user data
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }
  
}
