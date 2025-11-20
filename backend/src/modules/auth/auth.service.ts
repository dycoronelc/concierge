import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    console.log(`[Auth] Validando usuario: ${username}`);
    const user = await this.userRepository.findOne({ where: { username } });
    
    if (!user) {
      console.log(`[Auth] Usuario ${username} no encontrado`);
      return null;
    }
    
    console.log(`[Auth] Usuario encontrado: ${user.username}, role: ${user.role}`);
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log(`[Auth] Contraseña válida: ${isPasswordValid}`);
    
    if (isPasswordValid) {
      const { password, ...result } = user;
      return result;
    }
    
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.user_id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        nombre: user.nombre,
        role: user.role,
      },
    };
  }

  async register(data: {
    username: string;
    email: string;
    password: string;
    nombre: string;
    apellido?: string;
    role?: string;
  }): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    // Convertir role string a enum si viene como string
    let role: UserRole = UserRole.AGENTE;
    if (data.role) {
      role = data.role as UserRole;
    }
    
    const user = this.userRepository.create({
      username: data.username,
      email: data.email,
      password: hashedPassword,
      nombre: data.nombre,
      apellido: data.apellido,
      role: role,
    });

    return this.userRepository.save(user);
  }
}

