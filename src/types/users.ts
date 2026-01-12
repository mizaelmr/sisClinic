export interface User {
  id: number;
  name: string;
  cpf: string;
  profession?: string;
  email: string;
  phone: string;
  birthday: string;
  location: string;
  status: string;
  physiotherapistId?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  deletedAt?: string | Date;
}
