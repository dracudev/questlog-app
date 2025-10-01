import { IsString, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({ example: 'currentPassword' })
  @IsString()
  currentPassword: string;

  @ApiProperty({ example: 'NewStrongPassword123!', minLength: 8 })
  @IsString()
  @MinLength(8)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/,
    {
      message:
        'Password must contain at least one lowercase letter, one uppercase letter, one number and one special character',
    },
  )
  newPassword: string;
}
