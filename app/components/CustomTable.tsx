// components/CustomTable.tsx
import type { ReactNode } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "~/components/ui/table";

/* =========================
   Types
========================= */

export interface Column<T extends Record<string, unknown>> {
  key: keyof T;
  header: string | ReactNode;
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  align?: "left" | "center" | "right";
  sticky?: boolean;
  sortable?: boolean;
  headerClassName?: string;
  cellClassName?: string;
  headerStyle?: React.CSSProperties;
  cellStyle?: React.CSSProperties;
  render?: (value: T[keyof T], row: T, index: number) => ReactNode;
  footer?: string | ReactNode | ((data: T[]) => ReactNode);
}

export interface TableAction<T extends Record<string, unknown>> {
  label: string | ReactNode;
  onClick: (row: T, index: number) => void;
  className?: string;
  show?: (row: T) => boolean;
  variant?: "default" | "destructive" | "outline" | "ghost";
}

export interface CustomTableProps<T extends Record<string, unknown>> {
  data: T[];
  columns: Column<T>[];

  caption?: string | ReactNode;
  title?: string | ReactNode;
  description?: string | ReactNode;
  borderRowBody?: boolean;
  className?: string;
  tableClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  rowClassName?: string | ((row: T, index: number) => string);

  striped?: boolean;
  hoverable?: boolean;
  bordered?: boolean;
  compact?: boolean;

  emptyMessage?: string | ReactNode;
  loadingMessage?: string | ReactNode;
  loading?: boolean;

  actions?: TableAction<T>[];
  showActions?: boolean;
  actionsHeader?: string;
  actionsWidth?: string;

  onRowClick?: (row: T, index: number) => void;
  onRowDoubleClick?: (row: T, index: number) => void;

  /* ✅ FIX اصلی اینجاست */
  selectable?: boolean;
  rowIdKey: keyof T;
  selectedRows?: Set<T[keyof T]>;
  onSelectionChange?: (selected: Set<T[keyof T]>) => void;

  showFooter?: boolean;
  footerContent?: ReactNode;
  autoCalculateFooter?: boolean;
}

/* =========================
   Component
========================= */

export function CustomTable<T extends Record<string, unknown>>({
  data,
  columns,

  caption,
  title,
  description,

  className = "",
  tableClassName = "",
  headerClassName = "",
  bodyClassName = "",
  footerClassName = "",
  rowClassName,
  borderRowBody = false,
  striped = false,
  hoverable = true,
  bordered = false,
  compact = false,

  emptyMessage = "No data to display",
  loadingMessage = "Loading...",
  loading = false,

  actions = [],
  showActions = false,
  actionsHeader = "Actions",
  actionsWidth = "120px",

  onRowClick,
  onRowDoubleClick,

  selectable = false,
  rowIdKey,
  selectedRows = new Set<T[keyof T]>(),
  onSelectionChange,

  showFooter = false,
  footerContent,
  autoCalculateFooter = false,
}: CustomTableProps<T>) {
  /* =========================
     Helpers
  ========================= */

  const getAlignClass = (align?: "left" | "center" | "right") => {
    if (align === "center") return "text-center";
    if (align === "right") return "text-right";
    return "text-left";
  };

  const getRowClassName = (row: T, index: number) => {
    const classes: string[] = [];

    if (borderRowBody) {
      classes.push("border-b-1 border-light-200!");
    } else {
      classes.push("border-0! border-none! border-transparent!");
    }

    if (striped && index % 2 === 1) classes.push(" bg-white");
    if (striped && index % 2 === 0) classes.push("bg-primary-50  ");

    // if (hoverable && index % 2 === 1) classes.push("hover:bg-white/50");
    // if (hoverable && index % 2 === 0) classes.push("hover:bg-primary-50/50");

    if (hoverable) classes.push("hover:bg-gray-100/5");

    if (onRowClick) classes.push("cursor-pointer");

    if (typeof rowClassName === "function") {
      classes.push(rowClassName(row, index));
    } else if (rowClassName) {
      classes.push(rowClassName);
    }

    return classes.join(" ");
  };

  /* =========================
     Selection Logic (FIXED)
  ========================= */

  const handleSelectAll = (checked: boolean) => {
    if (!onSelectionChange) return;

    if (checked) {
      const allIds = new Set<T[keyof T]>(data.map((row) => row[rowIdKey]));
      onSelectionChange(allIds);
    } else {
      onSelectionChange(new Set());
    }
  };

  const handleSelectRow = (row: T, checked: boolean) => {
    if (!onSelectionChange) return;

    const newSelection = new Set(selectedRows);
    const rowId = row[rowIdKey];

    checked ? newSelection.add(rowId) : newSelection.delete(rowId);
    onSelectionChange(newSelection);
  };

  const allSelected =
    data.length > 0 && data.every((row) => selectedRows.has(row[rowIdKey]));

  const someSelected =
    data.some((row) => selectedRows.has(row[rowIdKey])) && !allSelected;

  /* =========================
     Render
  ========================= */

  return (
    <div className={`space-y-4  ${className}`}>
      {(title || description) && (
        <div className="space-y-1">
          {title && <h2 className="text-2xl font-bold">{title}</h2>}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}

      <div className={`rounded-md ${bordered ? "bg-light-200" : ""}`}>
        <Table className={tableClassName}>
          {caption && <TableCaption>{caption}</TableCaption>}

          <TableHeader className={headerClassName}>
            <TableRow
              className={`${borderRowBody ? "border-b border-light-200!" : "border-0!"} p-2 `}
            >
              {selectable && (
                <TableHead className={`w-12 ${compact ? "py-2" : ""}`}>
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = someSelected;
                    }}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </TableHead>
              )}

              {columns.map((col, i) => (
                <TableHead
                  key={i}
                  className={`font-semibold! ${borderRowBody ? "border-b border-light-200!" : "border-0!"}  tracking-wider bg-white  ${getAlignClass(col.align)} ${compact ? "py-4!" : ""}`}
                  style={{
                    width: col.width,
                    minWidth: col.minWidth,
                    maxWidth: col.maxWidth,
                    ...col.headerStyle,
                  }}
                >
                  {col.header}
                </TableHead>
              ))}

              {showActions && actions.length > 0 && (
                <TableHead
                  className="text-center"
                  style={{ width: actionsWidth }}
                >
                  {actionsHeader}
                </TableHead>
              )}
            </TableRow>
          </TableHeader>

          <TableBody className={bodyClassName}>
            {loading ? (
              <TableRow className="border-0!">
                <TableCell colSpan={999} className="text-center py-8 border-0! whitespace-normal">
                  {loadingMessage}
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow className="border-0!">
                <TableCell colSpan={999} className="text-center py-8 border-0!">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, rowIndex) => (
                <TableRow
                
                  key={String(row[rowIdKey])}
                  className={getRowClassName(row, rowIndex)}
                  onClick={() => onRowClick?.(row, rowIndex)}
                  onDoubleClick={() => onRowDoubleClick?.(row, rowIndex)}
                >
                  {selectable && (
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedRows.has(row[rowIdKey])}
                        onChange={(e) => handleSelectRow(row, e.target.checked)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </TableCell>
                  )}

                  {columns.map((col, i) => (
                    <TableCell key={i} className={getAlignClass(col.align)}>
                      {col.render
                        ? col.render(row[col.key], row, rowIndex)
                        : String(row[col.key] ?? "")}
                    </TableCell>
                  ))}

                  {showActions && actions.length > 0 && (
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-2">
                        {actions.map((action, i) =>
                          action.show?.(row) === false ? null : (
                            <button
                              key={i}
                              onClick={(e) => {
                                e.stopPropagation();
                                action.onClick(row, rowIndex);
                              }}
                              className={
                                action.className ??
                                "px-3 py-1 text-xs rounded bg-primary text-primary-foreground"
                              }
                            >
                              {action.label}
                            </button>
                          )
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>

          {showFooter && (
            <TableFooter className={footerClassName}>
              <TableRow>
                {footerContent ?? (
                  <TableCell colSpan={999}>
                    جمع کل: {data.length} ردیف
                  </TableCell>
                )}
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </div>
    </div>
  );
}
