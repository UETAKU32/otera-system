'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Member } from '../types/member'

export default function MemberInfoForm() {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phoneNumber: '',
    birthday: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string, name: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // ここで実際のデータ送信処理を行う
    setLoading(true);
    setError(null);
    setSuccess(null);


    const newMember: Omit<Member, "id"> = {
      name: formData.name,
      address: formData.address,
      phoneNumber: formData.phoneNumber,
      birthday: new Date(formData.birthday), // ここは日付の処理が必要かもしれません。
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
      
      setFormData({
        name: '',
        address: '',
        phoneNumber: '',
        birthday: '',
      })
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  const displayOptions = [
    { id: "name", label: "名前" },
    { id: "address", label: "住所" },
    { id: "phoneNumber", label: "電話番号" },
    { id: "birthday", label: "誕生日" },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">檀家情報入力フォーム</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayOptions.map(option => (
            <div key={option.id} className="space-y-2">
              <Label htmlFor={option.id} className="text-lg">{option.label}</Label>
              {option.id === 'status' ? (
                <Select onValueChange={(value) => handleSelectChange(value, 'status')}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="ステータスを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">有効</SelectItem>
                    <SelectItem value="inactive">無効</SelectItem>
                    <SelectItem value="pending">保留中</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id={option.id}
                  name={option.id}
                  value={formData[option.id as keyof typeof formData]}
                  onChange={handleChange}
                  required
                  className="w-full text-lg py-2"
                />
              )}
            </div>
          ))}
        </div>
        <Button type="submit" className="w-full text-lg py-6">送信</Button>
      </form>
    </div>
  )
}