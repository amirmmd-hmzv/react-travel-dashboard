import type { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

const ChartCard = ({ title, children, className = "" }: ChartCardProps) => {
  return (
    <div className={`flex flex-col gap-3 rounded-xl border bg-card p-5 shadow-sm ${className}`}>
      <h3 className="text-base font-semibold text-dark-100">{title}</h3>
      {children}
    </div>
  );
};

export default ChartCard;
