import { Roles } from '@prisma/client';

export interface UserWithoutSensitiveFields {
  id: number;
  email: string;
  roles: Roles[];
  firstName: string;
  lastName: string;
  dateRegistred: Date;
  isVerified: boolean;
}
