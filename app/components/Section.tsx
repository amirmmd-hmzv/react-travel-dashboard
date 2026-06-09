import type { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  bgWhite?: boolean;
}

const Section = ({ children, className = "", bgWhite = false }: SectionProps) => {
  return (
    <section className={`py-20 ${bgWhite ? "bg-white" : ""} ${className}`}>
      <div className="wrapper">{children}</div>
    </section>
  );
};

export default Section;
