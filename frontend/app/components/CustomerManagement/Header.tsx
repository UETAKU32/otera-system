import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SlidersHorizontal } from "lucide-react"

type HeaderProps = {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Header({ searchTerm, setSearchTerm, setIsSidebarOpen }: HeaderProps) {
  return (
    <header className="flex items-center justify-between p-4 border-b">
      <h1 className="text-2xl font-bold">檀家管理システム</h1>
      <div className="flex items-center space-x-2">
        <Input
          type="search"
          placeholder="検索..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-64"
        />
        <Button variant="outline" size="icon" onClick={() => setIsSidebarOpen(prev => !prev)}>
          <SlidersHorizontal className="h-4 w-4" />
          <span className="sr-only">表示オプションを開く</span>
        </Button>
      </div>
    </header>
  )
}
