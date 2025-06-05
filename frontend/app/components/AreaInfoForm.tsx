"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { Area } from "../types/area";
import { useMutateAreas } from "./hooks/useAreas";
import { useTemples } from "./hooks/useTemples";


export type AreaForm = Omit<Area, "id"> & {
    templeIds: number[];
};

//HACK: フィールド名を再定義しているようで保守性が悪い
type FieldLabel = {
  id: "name" ;
  label: string;
};

export default function AreaInfoForm() {
  const { data: temples, isPending: isPendingTemples, isError: isErrorTemples } = useTemples();

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
    await createArea(data);
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
          {/* 名前入力欄 */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-lg" style={{ color: "#333" }}>
              名前
            </Label>
            <Input
              {...register("name")}
              id="name"
              className="w-full text-lg py-2"
              style={{ color: "#333" }}
            />
            {errors.name && (
              <span className="text-red-500">{errors.name?.message}</span>
            )}
          </div>

          {/* 複数選択可能な寺院チェックボックス */}
          <div className="space-y-2">
            <Label className="text-lg" style={{ color: "#333" }}>
              寺院を選択（複数選択可）
            </Label>
            {isPendingTemples ? (
              <div>読み込み中...</div>
            ) : isErrorTemples ? (
              <div>エラーが発生しました</div>
            ) : (
              <div className="flex flex-col gap-2 max-h-48 overflow-y-auto border p-2 rounded">
                {temples.length > 0 ? (
                  temples.map((temple) => (
                    <label key={temple.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        value={temple.id}
                        {...register("templeIds")}
                        className="accent-blue-500"
                      />
                      {temple.name}
                    </label>
                  ))
                ) : (
                  <div>寺院データがありません</div>
                )}
              </div>
            )}
            {errors.templeIds && (
              <span className="text-red-500">{errors.templeIds?.message}</span>
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
          <p className="text-green-500">寺データが正常に作成されました</p>
        )}
      </form>
    </div>
  );
}
