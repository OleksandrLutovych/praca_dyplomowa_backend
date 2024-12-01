export class PatientProfileDataDto {
  personalData: {
    name: string;
    lastName: string;
  };
  contactData: {
    email: string;
    phone: string;
  };
  age: string;
  pesel: string;
  address: string;
}
