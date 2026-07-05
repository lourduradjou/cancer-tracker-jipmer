import { forwardRef } from 'react'
import { Input } from '@/components/ui/input'
import { Loader2, Search } from 'lucide-react'

interface SearchInputProps {
    value: string
    onChange: (val: string) => void
    placeholder?: string
    isSearching?: boolean
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
    ({ value, onChange, placeholder = 'Search...', isSearching = false }, ref) => {
        return (
            <div className="relative w-full md:w-[500px]">
                <Search
                    className="text-muted-foreground absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2"
                    aria-hidden="true"
                />

                <Input
                    ref={ref}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    aria-label="Search"
                    className="w-full pr-8 pl-8"
                />

                {isSearching && ( 
                    <Loader2 
                        className="text-muted-foreground absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2 animate-spin" 
                        aria-hidden="true" 
                    /> 
                )}
            </div>
        )
    }
)

SearchInput.displayName = 'SearchInput'