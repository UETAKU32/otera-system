"use client"

import { useState } from 'react'
import Header from './CustomerManagement/Header'
import CustomerTable from './CustomerManagement/CustomerTable'
import Sidebar from './CustomerManagement/Sidebar'
import { useMembers } from './hooks/useMembers'

// 仮の顧客データ
const customers = [
  { id: 1, name: "山田太郎",address:"東京都千代田区", email: "yamada@example.com", phone: "03-1234-5678",  belongs: "寺院A", status: "アクティブ" },
  { id: 2, name: "鈴木花子",address:"東京都台東区", email: "suzuki@example.com", phone: "03-8765-4321", belongs: "寺院B", status: "非アクティブ" },
  { id: 3, name: "佐藤次郎",address:"東京都新宿区", email: "sato@example.com", phone: "03-2345-6789", belongs: "寺院C", status: "アクティブ" },
]

// 表示オプション
const displayOptions = [
  { id: "name", label: "名前" },
  { id: "address", label: "住所" },
  { id: "email", label: "メールアドレス" },
  { id: "phone", label: "電話番号" },
  { id: "belongs", label: "所属寺" },
  { id: "status", label: "ステータス" },
]

export default function CustomerManagement() {
  const { data: members, isLoading, isError } = useMembers();
  console.log({members, isLoading, isError});
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedOptions, setSelectedOptions] = useState(["name", "address","phone"])
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const filteredCustomers = customers.filter(customer =>
    Object.values(customer).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  const toggleOption = (optionId: string) => {
    setSelectedOptions(prev =>
      prev.includes(optionId)
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    )
  }

  if(!members) return (<>App loading...</>);
  console.log({members});

  return (
    <div className="flex flex-col h-screen">
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <div className="flex flex-1 overflow-hidden">
        <CustomerTable
          customers={filteredCustomers}
          selectedOptions={selectedOptions}
          displayOptions={displayOptions}
        />
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          displayOptions={displayOptions}
          selectedOptions={selectedOptions}
          toggleOption={toggleOption}
        />
      </div>
    </div>
  )
}
