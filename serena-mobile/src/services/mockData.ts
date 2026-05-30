export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  image: string;
  experience: string;
}

export const MOCK_DOCTORS: Doctor[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    rating: 4.8,
    image: "https://i.pravatar.cc/150?u=sarah",
    experience: "10 years",
  },
  // Thêm các bác sĩ khác ở đây...
];
