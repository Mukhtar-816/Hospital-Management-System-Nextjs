import type React from "react";

export const TableHeader = ({ headers }: { headers: string[] }) => {
  return (
    <thead>
      <tr className="bg-border/5 border-b border-border">
        {headers.map((header, i) => (
          <th
            key={`${header}-${i}`}
            className="px-6 py-3 text-xs font-semibold text-textMuted uppercase tracking-wider"
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
    <div className={`w-full overflow-x-auto rounded-xl border border-border ${className}`}>
      <table className="w-full text-left border-collapse">
        {headers && <TableHeader headers={headers} />}
        <tbody>{children}</tbody>
      </table>
    </div>
  );
};

export const TableRow = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <tr role="row" className={`hover:bg-border/5 transition-colors ${className}`}>
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
  <td className={`px-6 py-4 text-sm text-text whitespace-nowrap ${className}`}>
    {children}
  </td>
);