import React from "react";

interface StatusCellProps {
  status?: string;
}

export default function StatusCell({ status }: StatusCellProps) {
  const statusLower = status?.toLowerCase();

  const colorClass =
    statusLower === "alive"
      ? "bg-border text-green-600"
      : statusLower === "death"
      ? "bg-border text-red-600"
      : statusLower === "ongoing"
      ? "bg-border text-blue-600"
      : statusLower === "followup"
      ? "bg-border text-yellow-600"
      : "text-muted-foreground";

  return (
    <span
      className={`rounded px-2 py-1 font-medium tracking-wider capitalize ${colorClass}`}
    >
      {status || "None"}
    </span>
  );
}
