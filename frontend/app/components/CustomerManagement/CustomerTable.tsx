import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Member } from "@/app/types/member"
import { useState } from "react"
import { Area } from "@/app/types/area";


type CustomerTableProps = {
  members: Member[];
  selectedOptions: string[];
  displayOptions: { id: string; label: string }[];
}

export default function CustomerTable({ members, selectedOptions, displayOptions }: CustomerTableProps) {

const output = (option:String,member: Member):any=> {
  if(option == "templeName" ) {
    return member.temple.name
  }
  if(option == "areas" ) {
    return (
      <AreaList areas={member.temple.areas} />
    )
  }
  return member[option as keyof Member]
}

  return (
    <main className="flex-1 overflow-auto p-4">
      <Table>
        <TableHeader>
          <TableRow>
            {selectedOptions.map(option => (
              <TableHead key={option}>{displayOptions.find(o => o.id === option)?.label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map(member => (
            <TableRow key={member.id}>
              {selectedOptions.map(option => (
                <TableCell key={option}>{output(option,member)}</TableCell> 
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  )
}

// 地区リスト表示用コンポーネント
function AreaList({ areas }: { areas: Area[] }) {
  const [showAll, setShowAll] = useState(false);
  if (areas.length === 0) return null;
  return (
    <div>
      <ul className="list-disc pl-5">
        <li key={areas[0].id}>{areas[0].name}</li>
        {showAll &&
          areas.slice(1).map((area) => (
            <li key={area.id}>{area.name}</li>
          ))}
      </ul>
      {areas.length > 1 && (
        <button
          type="button"
          className="mt-2 text-blue-600 hover:underline text-sm"
          onClick={() => setShowAll((prev) => !prev)}
        >
          {showAll ? "閉じる" : `もっと見る（${areas.length - 1}件）`}
        </button>
      )}
    </div>
  );
}
