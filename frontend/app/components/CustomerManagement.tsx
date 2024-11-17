"use client"

import { useState } from 'react'
import Header from './CustomerManagement/Header'
import CustomerTable from './CustomerManagement/CustomerTable'
import Sidebar from './CustomerManagement/Sidebar'
import { useMembers } from './hooks/useMembers'

// 表示オプション
const displayOptions = [
  { id: "id", label: "ID" },
  { id: "name", label: "名前" },
  { id: "address", label: "住所" },
  { id: "phoneNumber", label: "電話番号" },
  { id: "birthday", label: "誕生日" },
]

export default function CustomerManagement() {
  const { data: members, isLoading, isError } = useMembers();
  console.log({members, isLoading, isError});
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedOptions, setSelectedOptions] = useState(["name", "address","phoneNumber"])
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  if(!members) return (<>App loading...</>);
  console.log({members});

  const filteredCustomers = members.filter(members =>
    Object.values(members).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  const toggleOption = (optionId: string) => {
    setSelectedOptions(prev =>
      prev.includes(optionId)
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    )
  }

  return (
    <div className="flex flex-col h-screen">
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <div className="flex flex-1 overflow-hidden">
        <CustomerTable
          members={filteredCustomers}
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
