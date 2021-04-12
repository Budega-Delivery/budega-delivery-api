export class CreateUserDto {
  username?: string;
  email: string;
  firstName: string;
  lastName: string;
  enabled: boolean;
  role?: string;
}
