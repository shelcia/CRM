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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toLabel } from "@/utils";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";

export interface TableColumn {
  name: string;
  label: string;
  options?: {
    customBodyRender?: (value: any, rowIndex?: number) => React.ReactNode;
    sortable?: boolean;
    sortValue?: (row: any) => string | number;
  };
}

export interface ServerSideColumnFilter {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

export interface ServerSideProps {
  total: number;
  page: number; // 1-indexed
  pageSize: number;
  onPageChange: (page: number) => void;
  onSearchChange: (search: string) => void;
  loading?: boolean;
  columnFilters?: Record<string, ServerSideColumnFilter>;
}

interface CustomTableProps<
  TData extends Record<string, any> = Record<string, any>,
> {
  columns: TableColumn[];
  data: TData[];
  title?: string;
  downloadName?: string;
  pageSize?: number;
  serverSide?: ServerSideProps;
}

const CustomTable = <TData extends Record<string, any>>({
  columns: colDefs,
  data,
  title = "Table",
  downloadName = "file",
  pageSize = 10,
  serverSide,
}: CustomTableProps<TData>) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [serverSearch, setServerSearch] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [showColumnFilters, setShowColumnFilters] = useState(false);

  // Debounce server-side search
  React.useEffect(() => {
    if (!serverSide) return;
    const t = setTimeout(() => serverSide.onSearchChange(serverSearch), 350);
    return () => clearTimeout(t);
  }, [serverSearch]); // eslint-disable-line react-hooks/exhaustive-deps

  const columns = useMemo<ColumnDef<TData>[]>(
    () =>
      colDefs.map((col) => ({
        id: col.name,
        accessorKey: col.name,
        header: col.label,
        enableSorting: col.options?.sortable ?? !col.options?.customBodyRender,
        enableColumnFilter: !col.options?.customBodyRender,
        ...(col.options?.sortValue && {
          sortingFn: (rowA: any, rowB: any) => {
            const a = col.options!.sortValue!(rowA.original);
            const b = col.options!.sortValue!(rowB.original);
            return a < b ? -1 : a > b ? 1 : 0;
          },
        }),
        cell: col.options?.customBodyRender
          ? ({ getValue, row }) =>
              col.options!.customBodyRender!(getValue(), row.index)
          : ({ getValue }) => (getValue() as string) ?? "—",
      })),
    [colDefs],
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter: serverSide ? "" : globalFilter,
      columnFilters: serverSide ? [] : columnFilters,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: serverSide ? undefined : setGlobalFilter,
    onColumnFiltersChange: serverSide ? undefined : setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    ...(serverSide
      ? {}
      : {
          getFilteredRowModel: getFilteredRowModel(),
          getPaginationRowModel: getPaginationRowModel(),
          initialState: { pagination: { pageSize } },
        }),
  });

  const activeFilterCount = serverSide?.columnFilters
    ? Object.values(serverSide.columnFilters).filter((f) => f.value).length
    : columnFilters.length;

  const downloadCSV = () => {
    const visibleCols = colDefs.filter(
      (c) => columnVisibility[c.name] !== false,
    );
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

  // Pagination display values
  const totalRows = serverSide
    ? serverSide.total
    : table.getFilteredRowModel().rows.length;
  const { pageIndex, pageSize: currentPageSize } = table.getState().pagination;
  const displayPage = serverSide ? serverSide.page : pageIndex + 1;
  const displayPageSize = serverSide ? serverSide.pageSize : currentPageSize;
  const displayPageCount = serverSide
    ? Math.ceil(serverSide.total / serverSide.pageSize) || 1
    : table.getPageCount() || 1;
  const from = totalRows === 0 ? 0 : (displayPage - 1) * displayPageSize + 1;
  const to = Math.min(displayPage * displayPageSize, totalRows);

  return (
    <div className="w-full rounded-lg border bg-card shadow-sm">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b gap-3 flex-wrap">
        <h2 className="text-base font-semibold">{title}</h2>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          {/* Global / server search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search..."
              value={serverSide ? serverSearch : globalFilter}
              onChange={(e) =>
                serverSide
                  ? setServerSearch(e.target.value)
                  : setGlobalFilter(e.target.value)
              }
              className="pl-8 pr-7 h-8 w-56 text-sm"
            />
            {(serverSide ? serverSearch : globalFilter) && (
              <button
                onClick={() =>
                  serverSide ? setServerSearch("") : setGlobalFilter("")
                }
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          {/* Toggle column filters */}
          {(!serverSide || serverSide.columnFilters) && (
            <Button
              variant={showColumnFilters ? "secondary" : "outline"}
              size="sm"
              onClick={() => setShowColumnFilters((v) => !v)}
              className="h-8 gap-1.5"
            >
              <Filter className="size-4" />
              Filter
              {activeFilterCount > 0 && (
                <span className="ml-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold w-4 h-4 flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          )}

          {/* Column visibility */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1.5">
                <Columns className="size-4" />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuLabel className="text-xs">
                Toggle columns
              </DropdownMenuLabel>
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
          <Button
            variant="outline"
            size="sm"
            onClick={downloadCSV}
            className="h-8"
          >
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
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {header.column.getCanSort() && (
                            <span className="text-muted-foreground/50">
                              {header.column.getIsSorted() === "asc" ? (
                                <ChevronUp className="size-4" />
                              ) : header.column.getIsSorted() === "desc" ? (
                                <ChevronDown className="size-4" />
                              ) : (
                                <ChevronsUpDown className="size-4" />
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
                    {headerGroup.headers.map((header) => {
                      const serverFilter =
                        serverSide?.columnFilters?.[header.id];
                      return (
                        <th key={`filter-${header.id}`} className="px-3 py-2">
                          {serverFilter ? (
                            <Select
                              value={serverFilter.value || "all"}
                              onValueChange={(v) =>
                                serverFilter.onChange(v === "all" ? "" : v)
                              }
                            >
                              <SelectTrigger className="h-7 text-xs">
                                <SelectValue placeholder="All" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                {serverFilter.options.map((opt) => (
                                  <SelectItem key={opt} value={opt}>
                                    {toLabel(opt)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : !serverSide && header.column.getCanFilter() ? (
                            <div className="relative">
                              <Input
                                value={
                                  (header.column.getFilterValue() as string) ??
                                  ""
                                }
                                onChange={(e) =>
                                  header.column.setFilterValue(
                                    e.target.value || undefined,
                                  )
                                }
                                placeholder={`Filter…`}
                                className="h-7 text-xs pr-6"
                              />
                              {header.column.getFilterValue() && (
                                <button
                                  onClick={() =>
                                    header.column.setFilterValue(undefined)
                                  }
                                  className="absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              )}
                            </div>
                          ) : null}
                        </th>
                      );
                    })}
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
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
            onClick={() =>
              serverSide
                ? serverSide.onPageChange(serverSide.page - 1)
                : table.previousPage()
            }
            disabled={
              serverSide ? serverSide.page <= 1 : !table.getCanPreviousPage()
            }
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="px-2">
            Page {displayPage} of {displayPageCount}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() =>
              serverSide
                ? serverSide.onPageChange(serverSide.page + 1)
                : table.nextPage()
            }
            disabled={
              serverSide
                ? serverSide.page >= displayPageCount
                : !table.getCanNextPage()
            }
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CustomTable;
