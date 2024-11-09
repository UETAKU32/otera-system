import { Checkbox } from "@/components/ui/checkbox"

type SidebarProps = {
  isSidebarOpen: boolean;
  displayOptions: { id: string; label: string }[];
  selectedOptions: string[];
  toggleOption: (optionId: string) => void;
}

export default function Sidebar({ isSidebarOpen, displayOptions, selectedOptions, toggleOption }: SidebarProps) {
  return (
    <aside className={`w-64 border-l p-4 overflow-auto transition-all duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <h2 className="text-lg font-semibold mb-4">表示オプション</h2>
      <div className="space-y-2">
        {displayOptions.map(option => (
          <div key={option.id} className="flex items-center space-x-2">
            <Checkbox
              id={option.id}
              checked={selectedOptions.includes(option.id)}
              onCheckedChange={() => toggleOption(option.id)}
            />
            <label htmlFor={option.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </aside>
  )
}
