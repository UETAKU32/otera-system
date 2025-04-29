"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { Area } from "../types/area";
import { useMutateAreas } from "./hooks/useAreas";


type AreaForm = Omit<Area, "id">;

//HACK: フィールド名を再定義しているようで保守性が悪い
type FieldLabel = {
  id: "name" ;
  label: string;
};

export default function AreaInfoForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
  } = useForm<AreaForm>({
    defaultValues: {
      name: "",
    },
  });

  const { mutateAsync: createArea, error } = useMutateAreas({
    onSuccess: reset,
  });

  const onSubmit = async (data: AreaForm) => {
    const newArea: Omit<Area, "id"> = {
      name: data.name,
    };
    await createArea(newArea);
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
          地区情報入力フォーム
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
