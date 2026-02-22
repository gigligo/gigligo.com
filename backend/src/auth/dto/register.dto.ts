import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsIn, IsBoolean } from 'class-validator';

export class RegisterDto {
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @IsString()
    @IsNotEmpty()
    fullName: string;

    @IsOptional()
    @IsString()
    @IsIn(['FREE', 'BUYER', 'SELLER', 'STUDENT', 'EMPLOYER'])
    role?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    nationalId?: string;

    @IsOptional()
    @IsBoolean()
    termsAccepted?: boolean;
}
