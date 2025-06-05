"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Member } from "../types/member";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMembers, useMutateMember } from "./hooks/useMembers";
import { useTemples } from "./hooks/useTemples";

export type MemberForm = Omit<Member, "id" | "temple">;

//HACK: Memberのフィールド名を再定義しているようで保守性が悪い
type FieldLabel = {
  id: "name" | "address" | "phoneNumber" | "birthday";
  label: string;
};

export default function MemberInfoForm() {
const { data: temples, isPending, isError } = useTemples();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
  } = useForm<MemberForm>({
    defaultValues: {
      name: "",
      address: "",
      phoneNumber: "",
      birthday: null,

    },
    resolver: yupResolver(
      yup.object().shape({
        name: yup.string().required("名前は必須です"),
        address: yup.string().min(10, "住所は10文字以上必要です"),
        phoneNumber: yup
          .string()
          .matches(
            /^[0-9]{10,11}$/,
            "電話番号は10〜11桁の数字で入力してください"
          ),
        birthday: yup
          .string()
          .test("is-date", "有効な日付を入力してください", (value) => {
            if (!value) return false;
            return !isNaN(new Date(value).getTime());
          }),
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) as any,
  });

  // mutateAsync: createMember は mutateAsync という名前で createMember 関数をラップしている
  const { mutateAsync: createMember, error } = useMutateMember({
    onSuccess: reset,
  });

  const onSubmit = async (data: MemberForm) => {
    const newMember: MemberForm = {
      name: data.name,
      address: data.address,
      phoneNumber: data.phoneNumber,
      birthday: data.birthday ? new Date(data.birthday) : null, //FIXME
      templeId: data.templeId
    };

    await createMember(newMember);
  };

  const displayOptions: FieldLabel[] = [
    { id: "name", label: "名前" },
    { id: "address", label: "住所" },
    { id: "phoneNumber", label: "電話番号" },
    { id: "birthday", label: "誕生日" },
  ];

  const hasError =
    Boolean(errors.name) ||
    Boolean(errors.address) ||
    Boolean(errors.phoneNumber) ||
    Boolean(errors.birthday);

  return (
    <div className="container mx-auto px-4 py-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg"
      >
        <h2
          className="text-3xl md:text-4xl font-bold text-center mb-8"
          style={{ color: "#333" }}
        >
          檀家情報入力フォーム
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayOptions.map((option) => (
            <div key={option.id} className="space-y-2">
              <Label
                htmlFor={option.id}
                className="text-lg"
                style={{ color: "#333" }}
              >
                {option.label}
              </Label>
              {/* 入力欄 */}
              <Input
                {...register(option.id)} // useForm の register を使用
                id={option.id}
                type={option.id === "birthday" ? "date" : "text"} // birthday フィールドを date 型に変更
                className="w-full text-lg py-2"
                style={{ color: "#333" }}
              />
              {/* エラーメッセージ表示 */}
              {errors[option.id] && (
                <span className="text-red-500">
                  {errors[option.id]?.message}
                </span>
              )}
            </div>
          ))}
                    {/* Temple selection */}
                    <div className="space-y-2">
            <Label
              htmlFor="temple"
              className="text-lg"
              style={{ color: "#333" }}
            >
              寺院を選択
            </Label>
            <select
              {...register("templeId")}
              id="temple"
              className="w-full text-lg py-2 border border-gray-300 rounded-md" // 枠線と角丸を追加
              style={{ color: "#333" }}
            >
              {isPending ? (
                <option>読み込み中...</option>
              ) : isError ? (
                <option>エラーが発生しました</option>
              ) : (
                temples.map((temple) => (
                  <option key={temple.id} value={temple.id}>
                    {temple.name}
                  </option>
                ))
              )}
            </select>
            {errors.templeId && (
              <span className="text-red-500">
                {errors.templeId?.message}
              </span>
            )}
          </div>
        </div>
        <Button
          type="submit"
          className="w-full text-lg py-6"
          disabled={isSubmitting || hasError}
          style={{ color: "#333" }}
        >
          送信
        </Button>
        {isSubmitting && <p>送信中...</p>}
        {error && <p className="text-red-500">{error.message}</p>}
        {isSubmitSuccessful && (
          <p className="text-green-500">メンバーが正常に作成されました</p>
        )}
      </form>
    </div>
  );
}
