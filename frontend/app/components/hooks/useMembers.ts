import { Member } from "@/app/types/member";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchMembers = () => {
    return axios.get<Member[]>(`http://localhost:8080/api/members`).then((res) => res.data);
  }

export const useMembers = () => {
    return useQuery({
      queryKey: ["members"],
      queryFn: fetchMembers,
    });
  }