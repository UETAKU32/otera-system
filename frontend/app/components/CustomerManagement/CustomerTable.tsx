import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type Customer = {
  id: number;
  [key: string]: string | number;
}

type CustomerTableProps = {
  customers: Customer[];
  selectedOptions: string[];
  displayOptions: { id: string; label: string }[];
}

export default function CustomerTable({ customers, selectedOptions, displayOptions }: CustomerTableProps) {
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
          {customers.map(customer => (
            <TableRow key={customer.id}>
              {selectedOptions.map(option => (
                <TableCell key={option}>{customer[option]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  )
}
