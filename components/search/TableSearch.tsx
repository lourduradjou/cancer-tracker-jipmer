import { Search } from 'lucide-react'
import React from 'react'
import { Input } from '../ui/input'

/*
    This component gets the placeholder and search key terms and also the filter function and data

    After a point it feels like it okay to just use it as an Ui, instead of employing any logics into it,
    so the parent could get the search value via state and handle the work.
*/
type Props = {
    placeholder: string
}

const TableSearch = ({ placeholder }: Props) => {
    return (
        <div className="relative w-full md:w-[450px]">
            <Search className="text-muted-foreground absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2" />
            <Input
                // ref={searchRef}
                // value={searchTerm}
                // onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={placeholder}
                className="w-full pl-8"
            />
        </div>
    )
}

export default TableSearch
