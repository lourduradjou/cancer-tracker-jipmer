// src/components/common/data-table/data-table.tsx
'use client';

import * as React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DataTablePagination } from './data-table-pagination';
import { DataTableToolbar } from './data-table-toolbar';
import { Button } from '@/components/ui/button'; // Assuming you have this
import { Input } from '@/components/ui/input'; // Assuming you have this

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  title: string;
  // Toolbar props
  globalSearchPlaceholder?: string;
  filterableFields?: { id: string; label: string; options: string[] | { value: string; label: string }[]; }[];
  exportData?: any[];
  onAddClick?: () => void;
  // Dialog render props (functions that return the specific dialog component)
  renderViewDialog?: (item: TData | null, open: boolean, onOpenChange: (open: boolean) => void) => React.ReactNode;
  renderEditDialog?: (item: TData | null, open: boolean, onOpenChange: (open: boolean) => void) => React.ReactNode;
  renderDeleteDialog?: (item: TData | null, open: boolean, onClose: () => void) => React.ReactNode;
  // Stats component (optional)
  statsComponent?: React.ReactNode;
}

export function DataTable<TData extends { id: string }, TValue>({
  columns,
  data,
  title,
  globalSearchPlaceholder,
  filterableFields,
  exportData,
  onAddClick,
  renderViewDialog,
  renderEditDialog,
  renderDeleteDialog,
  statsComponent,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState(''); // For global search

  // --- Modal State Management ---
  const [selectedItem, setSelectedItem] = React.useState<TData | null>(null);
  const [showViewModal, setShowViewModal] = React.useState(false);
  const [showEditModal, setShowEditModal] = React.useState(false); // For add/edit
  const [itemToDelete, setItemToDelete] = React.useState<TData | null>(null);

  const handleOpenView = (item: TData) => { setSelectedItem(item); setShowViewModal(true); };
  const handleOpenEdit = (item: TData | null = null) => { setSelectedItem(item); setShowEditModal(true); }; // null for add
  const handleOpenDelete = (item: TData) => { setItemToDelete(item); };

  const handleCloseView = () => { setSelectedItem(null); setShowViewModal(false); };
  const handleCloseEdit = () => { setSelectedItem(null); setShowEditModal(false); };
  const handleCloseDelete = () => { setItemToDelete(null); };


  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter, // Connect global filter state
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter, // Pass global filter state
    },
    // Define how global filter works (e.g., search across all string values)
    globalFilterFn: 'includesString', // Default simple string includes
  });

  // Responsive row count (from your original code)
  const [rowsPerPage, setRowsPerPage] = React.useState(8);
  React.useEffect(() => {
    let resizeTimeout: NodeJS.Timeout;
    const calculateRows = () => {
      const windowHeight = window.innerHeight;
      const reservedHeight = 300; // Adjust based on your layout
      const rowHeight = 52; // Approximate row height
      const usable = windowHeight - reservedHeight;
      setRowsPerPage(Math.max(4, Math.floor(usable / rowHeight)));
    };
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(calculateRows, 150);
    };
    calculateRows();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  // Update table page size when rowsPerPage changes
  React.useEffect(() => {
    table.setPageSize(rowsPerPage);
  }, [rowsPerPage, table]);


  return (
    <div className="w-full">
      <DataTableToolbar
        table={table}
        title={title}
        globalSearchPlaceholder={globalSearchPlaceholder}
        filterableFields={filterableFields}
        exportData={exportData}
        onAddClick={onAddClick || (() => handleOpenEdit(null))} // Default to opening generic edit dialog for add
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
                {/* Actions column header if any action handlers are provided */}
                {(renderViewDialog || renderEditDialog || renderDeleteDialog) && (
                  <TableHead className="text-center">Actions</TableHead>
                )}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                  {/* Actions column cells */}
                  {(renderViewDialog || renderEditDialog || renderDeleteDialog) && (
                    <TableCell className="text-center space-x-2">
                      {renderViewDialog && (
                        <Button variant="ghost" size="sm" onClick={() => handleOpenView(row.original)}>View</Button>
                      )}
                      {renderEditDialog && (
                        <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(row.original)}>Edit</Button>
                      )}
                      {renderDeleteDialog && (
                        <Button variant="ghost" size="sm" onClick={() => handleOpenDelete(row.original)}>Delete</Button>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length + (renderViewDialog || renderEditDialog || renderDeleteDialog ? 1 : 0)} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-wrap justify-between items-center mt-4 gap-4">
        {statsComponent}
        <DataTablePagination table={table} />
      </div>

      {/* Render Generic Dialogs based on props and internal state */}
      {selectedItem && showViewModal && renderViewDialog && renderViewDialog(selectedItem, showViewModal, handleCloseView)}
      {showEditModal && renderEditDialog && renderEditDialog(selectedItem, showEditModal, handleCloseEdit)}
      {itemToDelete && renderDeleteDialog && renderDeleteDialog(itemToDelete, !!itemToDelete, handleCloseDelete)}
    </div>
  );
}
