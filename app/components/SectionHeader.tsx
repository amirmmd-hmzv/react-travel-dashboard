import { Link } from "react-router";

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  linkText?: string;
  linkTo?: string;
  className?: string;
}

const SectionHeader = ({
  eyebrow,
  title,
  linkText,
  linkTo = "/trips",
  className = "",
}: SectionHeaderProps) => {
  return (
    <div className={`flex items-end justify-between mb-10 ${className}`}>
      <div>
        <p className="font-plus-jakarta text-primary-100 text-sm font-semibold uppercase tracking-widest mb-2">
          {eyebrow}
        </p>
        <h2 className="font-clash-display text-dark-100 text-4xl font-bold">
          {title}
        </h2>
      </div>
      {linkText && (
        <Link
          to={linkTo}
          className="hidden sm:flex items-center gap-1.5 text-primary-100 font-plus-jakarta text-sm font-semibold hover:text-primary-500 transition-colors"
        >
          {linkText}
          <img src="/assets/icons/arrow-down.svg" alt="" className="h-4 w-4 -rotate-90" />
        </Link>
      )}
    </div>
  );
};

export default SectionHeader;
