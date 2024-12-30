"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Deceased } from "../types/deceased";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutateDeceased } from "./hooks/useDeceased";

type DeceasedForm = Omit<Deceased, "id">;

//HACK: Memberのフィールド名を再定義しているようで保守性が悪い
type FieldLabel = {
  id: "name" | "kaimyou" | "relationToMember" | "memberId" | "deceasedDay" | "birthday" | "kyounen" | "comment";
  label: string;
};

export default function DeceasedInfoForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
  } = useForm<DeceasedForm>({
    defaultValues: {
      name: "",
      kaimyou: "",
      relationToMember: "",
      memberId: undefined,
      deceasedDay: null,
      birthday: null,
      kyounen: null,
      comment: ""
    },
    // resolver: yupResolver(
    //   yup.object().shape({
    //     name: yup.string().required("名前は必須です"),
    //     kaimyou: yup.string().required("戒名は必須です"),
    //     deceasedDay: yup
    //     .string()
    //     .test("is-date", "有効な日付を入力してください", (value) => {
    //       if (!value) return false;
    //       return !isNaN(new Date(value).getTime());
    //     }),
    //     birthday: yup
    //       .string()
    //       .test("is-date", "有効な日付を入力してください", (value) => {
    //         if (!value) return false;
    //         return !isNaN(new Date(value).getTime());
    //       }),
    //     kyounen: yup
    //       .string()
    //       .test("is-date", "有効な日付を入力してください", (value) => {
    //         if (!value) return false;
    //         return !isNaN(new Date(value).getTime());
    //       }),  
    //   })
    //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // ) as any,
  });

  // mutateAsync: createMember は mutateAsync という名前で createMember 関数をラップしている
  const { mutateAsync: createDeceased, error } = useMutateDeceased({
    onSuccess: reset,
  });

  const onSubmit = async (data: DeceasedForm) => {
    const newDeceased: Omit<Deceased, "id"> = {
      name: data.name,
      kaimyou: data.kaimyou,
      relationToMember: data.relationToMember,
      memberId: data.memberId,
      deceasedDay: data.deceasedDay ? new Date(data.deceasedDay) : null,
      birthday: data.birthday ? new Date(data.birthday) : null, //FIXME
      kyounen: data.kyounen ? new Date(data.kyounen) : null, //FIXME
      comment: data.comment
    };

    await createDeceased(newDeceased);
  };

  const displayOptions: FieldLabel[] = [
    { id: "name", label: "名前" },
    { id: "kaimyou", label: "戒名" },
    { id: "relationToMember", label: "施主との関係" },
    { id: "memberId", label: "檀家ID" },
    { id: "birthday", label: "誕生日" },
    { id: "deceasedDay", label: "亡日" },
    { id: "kyounen", label: "享年" },
    { id: "comment", label: "コメント" },
  ];

  const hasError =
    Boolean(errors.name) ||
    Boolean(errors.kaimyou) ||
    Boolean(errors.relationToMember) ||
    Boolean(errors.memberId) ||
    Boolean(errors.birthday) ||
    Boolean(errors.deceasedDay) ||
    Boolean(errors.kyounen) ||
    Boolean(errors.comment) ;

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
          故人情報入力フォーム
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
                type={option.id === "birthday" || option.id === "deceasedDay" || option.id === "kyounen" ? "date" : "text"} // 日付を要求するフィールドを date 型に変更
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
          disabled={isSubmitting || hasError}
          style={{ color: "#333" }}
        >
          送信
        </Button>
        {isSubmitting && <p>送信中...</p>}
        {error && <p className="text-red-500">{error.message}</p>}
        {isSubmitSuccessful && (
          <p className="text-green-500">故人データが正常に作成されました</p>
        )}
      </form>
    </div>
  );
}
