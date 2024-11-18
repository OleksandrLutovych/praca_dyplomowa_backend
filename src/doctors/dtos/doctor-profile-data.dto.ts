export class DoctorProfileDataDto {
  personalData: {
    name: string;
    lastName: string;
  };
  contactData: {
    email: string;
    phone: string;
  };
  professionalData: {
    proffesion: string;
    education: string;
    about: string;
  };
  services: {
    service: string;
    price: number;
    recomendations?: string;
  }[];
}
