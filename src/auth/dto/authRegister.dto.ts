import { IsNotEmpty, IsString, IsEmail, Length } from 'class-validator';

export class AuthRegisterDto {
  @IsNotEmpty()
  @IsString()
  @Length(4, 20, {
    message: 'Nome de usuário deve ser entre 4 e 20 caracteres',
  })
  public userName: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  public email: string;

  @IsNotEmpty({ message: 'Senha deve ser entre 6 e 20 caracteres' })
  @IsString()
  @Length(6, 20, { message: 'Senha deve ser entre 6 e 20 caracteres' })
  public password: string;
}
