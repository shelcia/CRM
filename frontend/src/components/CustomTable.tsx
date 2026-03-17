import React, { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
} from "@tanstack/react-table";
import {
  Download,
  Search,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  Columns,
  Filter,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";

export interface TableColumn<TData = Record<string, any>> {
  name: string;
  label: string;
  options?: {
    customBodyRender?: (value: any, rowIndex?: number) => React.ReactNode;
  };
}

interface CustomTableProps<TData extends Record<string, any> = Record<string, any>> {
  columns: TableColumn<TData>[];
  data: TData[];
  title?: string;
  downloadName?: string;
  pageSize?: number;
}

const CustomTable = <TData extends Record<string, any>>({
  columns: colDefs,
  data,
  title = "Table",
  downloadName = "file",
  pageSize = 10,
}: CustomTableProps<TData>) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [showColumnFilters, setShowColumnFilters] = useState(false);

  const columns = useMemo<ColumnDef<TData>[]>(
    () =>
      colDefs.map((col) => ({
        id: col.name,
        accessorKey: col.name,
        header: col.label,
        enableSorting: !col.options?.customBodyRender,
        enableColumnFilter: !col.options?.customBodyRender,
        cell: col.options?.customBodyRender
          ? ({ getValue, row }) => col.options!.customBodyRender!(getValue(), row.index)
          : ({ getValue }) => (getValue() as string) ?? "—",
      })),
    [colDefs],
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter, columnFilters, columnVisibility },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize } },
  });

  const activeFilterCount = columnFilters.length;

  const downloadCSV = () => {
    const visibleCols = colDefs.filter((c) => columnVisibility[c.name] !== false);
    const headers = visibleCols.map((c) => c.label).join(",");
    const rows = data.map((row) =>
      visibleCols.map((col) => `"${row[col.name] ?? ""}"`).join(","),
    );
    const csv = [headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${downloadName}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const { pageIndex, pageSize: currentPageSize } = table.getState().pagination;
  const totalRows = table.getFilteredRowModel().rows.length;
  const from = totalRows === 0 ? 0 : pageIndex * currentPageSize + 1;
  const to = Math.min((pageIndex + 1) * currentPageSize, totalRows);

  return (
    <div className="w-full rounded-lg border bg-card shadow-sm">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b gap-3 flex-wrap">
        <h2 className="text-base font-semibold">{title}</h2>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          {/* Global search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-8 h-8 text-xs w-48"
            />
          </div>

          {/* Toggle column filters */}
          <Button
            variant={showColumnFilters ? "secondary" : "outline"}
            size="sm"
            onClick={() => setShowColumnFilters((v) => !v)}
            className="h-8 gap-1.5"
          >
            <Filter className="h-3.5 w-3.5" />
            Filter
            {activeFilterCount > 0 && (
              <span className="ml-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold w-4 h-4 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </Button>

          {/* Column visibility */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1.5">
                <Columns className="h-3.5 w-3.5" />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuLabel className="text-xs">Toggle columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table
                .getAllColumns()
                .filter((col) => col.getCanHide())
                .map((col) => (
                  <DropdownMenuCheckboxItem
                    key={col.id}
                    className="text-xs capitalize"
                    checked={col.getIsVisible()}
                    onCheckedChange={(v) => col.toggleVisibility(v)}
                  >
                    {colDefs.find((c) => c.name === col.id)?.label ?? col.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* CSV download */}
          <Button variant="outline" size="sm" onClick={downloadCSV} className="h-8">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <React.Fragment key={headerGroup.id}>
                {/* Column headers */}
                <tr className="border-b bg-muted/50">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap"
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={
                            header.column.getCanSort()
                              ? "flex items-center gap-1 cursor-pointer select-none hover:text-foreground transition-colors"
                              : ""
                          }
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getCanSort() && (
                            <span className="text-muted-foreground/50">
                              {header.column.getIsSorted() === "asc" ? (
                                <ChevronUp className="h-3.5 w-3.5" />
                              ) : header.column.getIsSorted() === "desc" ? (
                                <ChevronDown className="h-3.5 w-3.5" />
                              ) : (
                                <ChevronsUpDown className="h-3.5 w-3.5" />
                              )}
                            </span>
                          )}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>

                {/* Per-column filter inputs */}
                {showColumnFilters && (
                  <tr className="border-b bg-muted/20">
                    {headerGroup.headers.map((header) => (
                      <th key={`filter-${header.id}`} className="px-3 py-2">
                        {header.column.getCanFilter() ? (
                          <div className="relative">
                            <Input
                              value={(header.column.getFilterValue() as string) ?? ""}
                              onChange={(e) => header.column.setFilterValue(e.target.value || undefined)}
                              placeholder={`Filter…`}
                              className="h-7 text-xs pr-6"
                            />
                            {header.column.getFilterValue() && (
                              <button
                                onClick={() => header.column.setFilterValue(undefined)}
                                className="absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        ) : null}
                      </th>
                    ))}
                  </tr>
                )}
              </React.Fragment>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={table.getVisibleLeafColumns().length}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  No records found
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 border-t text-xs text-muted-foreground flex-wrap gap-2">
        <span>
          {from}–{to} of {totalRows} rows
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="px-2">
            Page {pageIndex + 1} of {table.getPageCount() || 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CustomTable;
