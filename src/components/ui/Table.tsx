import type React from "react";
import { cn } from "@/lib/utils";

export const TableHeader = ({ headers }: { headers: string[] }) => {
  return (
    <thead>
      <tr className="bg-surface border-b border-border/50">
        {headers.map((header, i) => (
          <th
            key={`${header}-${i}`}
            className="px-6 py-4 text-[10px] font-black text-textMuted uppercase tracking-[0.15em] whitespace-nowrap"
          >
            {header}
          </th>
        ))}
      </tr>
    </thead>
  );
};

interface TableProps {
  children: React.ReactNode;
  headers?: string[];
  className?: string;
}

export const Table = ({ children, headers, className = "" }: TableProps) => {
  return (
    <div
      className={cn(
        "w-full overflow-x-auto rounded-2xl border border-border/50 bg-surface/30 backdrop-blur-sm custom-scrollbar",
        className
      )}
    >
      <table className="w-full text-left border-collapse">
        {headers && <TableHeader headers={headers} />}
        <tbody className="divide-y divide-border/30">{children}</tbody>
      </table>
    </div>
  );
};

export const TableRow = ({
  children,
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) => (
  <tr 
    onClick={onClick}
    className={cn(
      "group hover:bg-primary/[0.02] transition-colors cursor-default",
      onClick && "cursor-pointer",
      className
    )}
  >
    {children}
  </tr>
);

export const TableCell = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <td className={cn("px-6 py-5 text-sm font-medium text-text whitespace-nowrap transition-colors group-hover:text-primary", className)}>
    {children}
  </td>
);

