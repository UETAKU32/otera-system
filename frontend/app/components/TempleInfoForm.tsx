"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { Temple } from "../types/temple";
import { useMutateTemple } from "./hooks/useTemples";
import { useAreas } from "./hooks/useAreas";

type TempleForm = Omit<Temple, "id">;

//HACK: フィールド名を再定義しているようで保守性が悪い
type FieldLabel = {
  id: "name" ;
  label: string;
};

export default function TempleInfoForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
  } = useForm<TempleForm>({
    defaultValues: {
      name: "",
    },
  });

  const { mutateAsync: createTemple, error } = useMutateTemple({
    onSuccess: reset,
  });

  const { data: areas, isLoading, isError } = useAreas();

  console.log({areas})

  const onSubmit = async (data: TempleForm) => {
    const newTemple: Omit<Temple, "id"> = {
      name: data.name,
    };
    await createTemple(newTemple);
  };

  const displayOptions: FieldLabel[] = [
    { id: "name", label: "名前" },
  ];

  const hasError =
    Boolean(errors.name) 

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
          寺情報入力フォーム
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
          <p className="text-green-500">寺データが正常に作成されました</p>
        )}
      </form>
    </div>
  );
}
