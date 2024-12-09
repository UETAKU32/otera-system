"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Member } from "../types/member";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

type MemberForm = Omit<Member, "id">;

//HACK: Memberのフィールド名を再定義しているようで保守性が悪い
type FieldLabel = {
  id: "name" | "address" | "phoneNumber" | "birthday";
  label: string;
};

// const validators = {
//   name: (value: string) =>
//     (value && value.length >= 3) || "名前は3文字以上必要です",
//   address: (value: string) =>
//     value === "" || value.length >= 10 || "住所は10文字以上必要です",
//   phoneNumber: (value: string) =>
//     value === "" ||
//     /^[0-9]{10,11}$/.test(value) ||
//     "電話番号は10〜11桁の数字で入力してください",
//   birthday: (value: string) =>
//     value === "" ||
//     !isNaN(new Date(value).getTime()) ||
//     "有効な日付を入力してください",
// };

export default function MemberInfoForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
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
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onSubmit = async (data: MemberForm) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    const newMember: Omit<Member, "id"> = {
      name: data.name,
      address: data.address,
      phoneNumber: data.phoneNumber,
      birthday: data.birthday ? new Date(data.birthday) : null, //FIXME
    };

    try {
      const response = await fetch(`http://localhost:8080/api/members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMember),
      });

      if (!response.ok) {
        throw new Error("メンバーの作成に失敗しました");
      }

      setSuccess("メンバーが正常に作成されました");
      reset(); // フォームをリセット
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
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
        </div>
        <Button
          type="submit"
          className="w-full text-lg py-6"
          disabled={loading || hasError}
          style={{ color: "#333" }}
        >
          送信
        </Button>
        {loading && <p>送信中...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
      </form>
    </div>
  );
}
