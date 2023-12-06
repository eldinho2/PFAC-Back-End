import {
  BadRequestException,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { AuthRegisterDto } from './dto/authRegister.dto';
import { AuthLoginDto } from './dto/authLogin.dto';
import { PrismaService } from 'prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JwtSecret } from 'src/utils/constants';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async signup(dto: AuthRegisterDto, res: Response) {
    const { userName, email, password } = dto;

    const userEmailExists = await this.prisma.user.findUnique({
      where: { email },
    });

    if (userEmailExists) {
      throw new BadRequestException('Email ja cadastrado.');
    }

    const userNameExists = await this.prisma.user.findUnique({
      where: { userName },
    });

    if (userNameExists) {
      throw new BadRequestException('Nome de usuario ja cadastrado.');
    }

    const hashedPassword = await this.hashPassword(password);

    await this.prisma.user.create({
      data: {
        userName,
        email,
        hashedPassword,
      },
    });

    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        userName: true,
      },
    });

    const token = await this.signTokenJwt({
      id: user.id,
      userName: user.userName,
    });

    res.status(200).send({ message: token });

    return token;
  }

  async signin(dto: AuthLoginDto, res: Response) {
    const { email, password } = dto;

    const foundUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        userName: true,
        hashedPassword: true,
      },
    });

    if (!foundUser) {
      throw new BadRequestException('Email ou usuario incorreto');
    }

    const validPassword = await this.comparePasswords(
      password,
      foundUser.hashedPassword,
    );

    if (!validPassword) {
      throw new BadRequestException('Email ou usuario incorreto');
    }

    const token = await this.signTokenJwt({
      id: foundUser.id,
      userName: foundUser.userName,
    });

    if (!token) {
      throw new ForbiddenException('Could not signin');
    }

    res.status(200).send({ message: token });

    return token;
  }

  async signout(res: Response) {
    res.clearCookie('token');

    return res.send({ message: 'Logout com sucesso' });
  }

  async emailUserExists(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    return user ? true : false;
  }

  async userNameExists(userName: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        userName,
      },
    });
    return user ? true : false;
  }

  async hashPassword(password: string) {
    const saltOrRounds = 10;
    return await bcrypt.hash(password, saltOrRounds);
  }

  async comparePasswords(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }

  async signTokenJwt(args: { id: string; userName: string }) {
    const payload = args;

    return this.jwt.sign(payload, { secret: JwtSecret });
  }
}
