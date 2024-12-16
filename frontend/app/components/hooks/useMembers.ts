import { Member } from "@/app/types/member";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchMembers = () => {
  return axios
    .get<Member[]>(`http://localhost:8080/api/members`)
    .then((res) => res.data);
};

export const useMembers = () => {
  return useQuery({
    queryKey: ["members"],
    queryFn: fetchMembers,
  });
};

/**
 * useMemberDetailはidが変更されるたびにクエリを実行する
 * nullの場合はクエリを実行しない
 */
export const useMemberDetail = (id: number | null) => {
  return useQuery({
    queryKey: ["members", id],
    //HACK: idがnullの場合はクエリを実行しないため,0がバックエンドにわたることはありえない。id ?? 0はidがnullの場合は0を渡す
    queryFn: () => fetchMemberDetail(id ?? 0).then((data) => data),
    enabled: Boolean(id), //enabledがfalseの場合はクエリを実行しない。Boolean(id)はidがnullであればfalseになる
  });
};

/**
 * メンバー詳細を取得する関数だが、バックエンドに実装がないため当然404エラーで動作しないため注意
 */
const fetchMemberDetail = (id: number) => {
  return axios
    .get<Member>(`http://localhost:8080/api/members/${id}`)
    .then((res) => res.data);
};

interface UseMutateMemberProps {
  /** 通信が成功した際のハンドラ */
  onSuccess: () => void;
}

/** メンバーの作成を行う */
export const useMutateMember = ({ onSuccess }: UseMutateMemberProps) => {
  return useMutation({
    mutationFn: createMember,
    onSuccess,
  });
};

const createMember = (member: Omit<Member, "id">) => {
  return axios
    .post<Member>(`http://localhost:8080/api/members`, member, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => res.data);
};
