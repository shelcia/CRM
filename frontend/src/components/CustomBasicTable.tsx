import React from "react";

interface Column {
  title: string;
  field: string;
}

export const CustomBasicHorizontalTable = ({
  columns,
  data,
}: {
  columns: Column[];
  data: Record<string, any>;
}) => {
  return (
    <div className="w-full overflow-hidden rounded-md border">
      <table className="w-full text-sm">
        <tbody>
          {columns.map((col, idx) => (
            <tr key={idx} className="border-b last:border-0 even:bg-muted/30">
              <td className="px-4 py-2.5 font-medium text-muted-foreground w-1/3">
                {col.title}
              </td>
              <td className="px-4 py-2.5">{data?.[col.field] ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
