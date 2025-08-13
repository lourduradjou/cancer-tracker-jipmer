// src/components/common/data-table/data-table-toolbar.tsx
'use client';

import { Table } from '@tanstack/react-table';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// Import your custom filter components if you have them (e.g., multi-select filter)
// For now, we'll use a simple text input for global filter.

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  title: string;
  globalSearchPlaceholder?: string;
  filterableFields?: { id: string; label: string; options: string[] | { value: string; label: string }[]; }[];
  exportData?: any[];
  onAddClick?: () => void;
}

export function DataTableToolbar<TData>({
  table,
  title,
  globalSearchPlaceholder,
  filterableFields,
  exportData,
  onAddClick,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0 || table.getState().globalFilter.length > 0;

  const handleExport = () => {
    if (exportData && exportData.length > 0) {
      const headers = Object.keys(exportData[0]).join(',');
      const rows = exportData.map(row => Object.values(row).map(val => (String(val).includes(',') ? `"${val}"` : val)).join(',')).join('\n');
      const csv = `${headers}\n${rows}`;
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', `${title.toLowerCase().replace(/\s/g, '-')}-data.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert('No data to export.');
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 py-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="flex items-center gap-2 flex-grow max-w-lg">
        <Input
          placeholder={globalSearchPlaceholder || `Search ${title.toLowerCase()}...`}
          value={(table.getState().globalFilter as string) ?? ''}
          onChange={(event) => table.setGlobalFilter(event.target.value)}
          className="flex-grow"
        />
        {/* Add column filters here if needed. This is where your Popover/Checkbox logic for diseases/sexes would go.
            For simplicity, we're using globalFilter for now.
            Example for a column filter (you'd need to adapt your multi-select logic):
            {table.getColumn('status') && (
                <DataTableFacetedFilter
                    column={table.getColumn('status')}
                    title="Status"
                    options={[{ label: 'Alive', value: 'Alive' }, { label: 'Death', value: 'Death' }]}
                />
            )}
        */}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              table.resetColumnFilters();
              table.setGlobalFilter('');
            }}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        {exportData && <Button variant="outline" onClick={handleExport}>Export CSV</Button>}
        {onAddClick && <Button onClick={onAddClick}>Add New {title.slice(0, -1)}</Button>}
      </div>
    </div>
  );
}
