import { Temple } from "@/app/types/temple";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";


export const useMutateTemple = ({ onSuccess }: { onSuccess: () => void }) => {
  return useMutation({
    mutationFn: async (temple: Omit<Temple, "id">) => {
      console.log("mutete呼び出されてる")
      const { data } = await axios.post('http://localhost:8080/api/temple', temple);//axiosにホスト情報（localhost8080を設定する)
      return data;
    },
    onSuccess,
  });
};