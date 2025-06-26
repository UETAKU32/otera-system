"use client";

import { useState } from "react";
import Header from "./CustomerManagement/Header";
import CustomerTable from "./CustomerManagement/CustomerTable";
import Sidebar from "./CustomerManagement/Sidebar";
import { useMembers } from "./hooks/useMembers";

// 表示オプション
//TODO #28 https://github.com/UETAKU32/otera-system/issues/28
const displayOptions = [
  { id: "id", label: "ID" },
  { id: "name", label: "名前" },
  { id: "address", label: "住所" },
  { id: "phoneNumber", label: "電話番号" },
  { id: "birthday", label: "誕生日" },
  { id: "templeName", label: "所属寺" },
  { id: "areas", label: "所属地区" },
];

export default function CustomerManagement() {
  const { data: members, isLoading, isError } = useMembers();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([
    "name",
    "address",
    "phoneNumber",
  ]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  //NOTE: クエリキーの説明で使ったコードです
  //const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
  //const { data: memberDetail } = useMemberDetail(selectedMemberId);

  if (!members) return <>App loading...</>;

  const filteredCustomers = members.filter((member) =>
    Object.values(member).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const toggleOption = (optionId: string) => {
    setSelectedOptions((prev) =>
      prev.includes(optionId)
        ? prev.filter((id) => id !== optionId)
        : [...prev, optionId]
    );
  };

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
  );
}
