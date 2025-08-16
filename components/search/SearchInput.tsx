import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

export function SearchInput({
    value,
    onChange,
    placeholder = 'Search...',
}: {
    value: string
    onChange: (val: string) => void
    placeholder?: string
}) {
    return (
        <div className="relative w-full md:w-[400px]">
            <Search className="text-muted-foreground absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2" />
            <Input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full pl-8"
            />
        </div>
    )
}
