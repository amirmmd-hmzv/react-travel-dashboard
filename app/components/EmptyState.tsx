import { Link } from "react-router";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  ctaText?: string;
  ctaLink?: string;
  className?: string;
}

const EmptyState = ({
  icon = "/assets/icons/destination.svg",
  title,
  description,
  ctaText,
  ctaLink,
  className = "",
}: EmptyStateProps) => {
  return (
    <div className={`flex flex-col items-center justify-center py-24 gap-6 text-center ${className}`}>
      <div className="w-20 h-20 rounded-2xl bg-primary-50 flex items-center justify-center">
        <img src={icon} alt="" className="h-10 w-10 opacity-50" />
      </div>
      <div>
        <p className="font-clash-display text-dark-100 text-2xl font-semibold mb-2">
          {title}
        </p>
        <p className="font-plus-jakarta text-gray-100 text-sm max-w-xs">
          {description}
        </p>
      </div>
      {ctaText && ctaLink && (
        <Link
          to={ctaLink}
          className="mt-2 bg-primary-100 hover:bg-primary-500 text-white font-plus-jakarta font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors"
        >
          {ctaText}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
