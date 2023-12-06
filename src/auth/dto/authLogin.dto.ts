import { IsNotEmpty, IsString, IsEmail, Length } from 'class-validator';

export class AuthLoginDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  public email: string;

  @IsNotEmpty({ message: 'Senha deve ser entre 6 e 20 caracteres' })
  @IsString()
  @Length(6, 20, { message: 'Senha deve ser entre 6 e 20 caracteres' })
  public password: string;
}
