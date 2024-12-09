'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Member } from '../types/member'
import { useForm } from 'react-hook-form'

export default function MemberInfoForm() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onSubmit = async (data: any) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    const newMember: Omit<Member, "id"> = {
      name: data.name,
      address: data.address,
      phoneNumber: data.phoneNumber,
      birthday: new Date(data.birthday),
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
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const displayOptions = [
    { id: "name", label: "名前" },
    { id: "address", label: "住所" },
    { id: "phoneNumber", label: "電話番号" },
    { id: "birthday", label: "誕生日" },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">檀家情報入力フォーム</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayOptions.map(option => (
            <div key={option.id} className="space-y-2">
              <Label htmlFor={option.id} className="text-lg">{option.label}</Label>
              {/* 入力欄 */}
              <Input
                {...register(option.id, { required: true })} // useForm の register を使用
                id={option.id}
                type={option.id === 'birthday' ? 'date' : 'text'} // birthday フィールドを date 型に変更
                className="w-full text-lg py-2"
                style={{ color: '#333' }} 
              />
              {/* エラーメッセージ表示 */}
              {errors[option.id]?.type === 'required' && <span className="text-red-500">必須項目です</span>}
            </div>
          ))}
        </div>
        <Button type="submit" className="w-full text-lg py-6" disabled={loading}>送信</Button>
        {loading && <p>送信中...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
      </form>
    </div>
  )
}