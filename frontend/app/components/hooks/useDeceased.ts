import { Deceased } from "@/app/types/deceased";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchDeceased = () => {
  return axios
    .get<Deceased[]>(`http://localhost:8080/api/members`)
    .then((res) => res.data);
};

export const useMembers = () => {
  return useQuery({
    queryKey: ["deceased"],
    queryFn: fetchDeceased,
  });
};

export const useMutateDeceased = ({ onSuccess }: { onSuccess: () => void }) => {
  return useMutation({
    mutationFn: async (deceased: Omit<Deceased, "id">) => {
      const { data } = await axios.post('http://localhost:8080/api/deceased', deceased);//axiosにホスト情報（localhost8080を設定する)
      return data;
    },
    onSuccess,
  });
};
