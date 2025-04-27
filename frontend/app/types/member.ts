import { Temple } from "./temple";

export type Member = {
    id: number;
    name: string;
    address: string | null;
    phoneNumber: string | null;
    birthday: Date | null;
    templeId :number;
    temple :Temple
  };