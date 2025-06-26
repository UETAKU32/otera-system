import { Area } from "./area";

export type Temple = {
    id: number;
    name: string;
    areaIds: number[];
    areas: Area[];
  };