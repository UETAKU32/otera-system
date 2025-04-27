import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Member } from "@/app/types/member"


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
