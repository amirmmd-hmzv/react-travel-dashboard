// components/ui/Chip.tsx

import type { IconType } from "react-icons";
import { LuX } from "react-icons/lu";

type ChipSize = "sm" | "md" | "lg";
type ChipColor = "primary" | "pink";
type ChipVariant = "default" | "solid" | "outline";

interface ChipProps {
  children: React.ReactNode;
  variant?: ChipVariant;
  size?: ChipSize;
  color?: ChipColor;
  icon?: IconType;
  removable?: boolean;
  onRemove?: () => void;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const Chip = ({
  children,
  variant = "default",
  size = "md",
  color = "primary",
  icon: Icon,
  removable = false,
  onRemove,
  onClick,
  disabled = false,
  className = "",
}: ChipProps) => {
  const colors: Record<ChipColor, string> = {
    primary: "bg-primary-100 text-primary-700 border-primary-200 hover:bg-primary-200",
    pink: "bg-pink-100 text-pink-700 border-pink-200 hover:bg-pink-200",
  };

  const variants: Record<ChipVariant, Record<ChipColor, string> | string> = {
    default: colors[color],
    solid: {
      primary: "bg-primary-500 text-white ",
      pink: "bg-pink-500 text-white ",
    },
    outline: {
      primary: "bg-primary-50 text-primary-500 border-primary-100 ",
      pink: "bg-pink-50 text-pink-500 border-pink-100 ",
    },
  };

  const sizes: Record<ChipSize, string> = {
    sm: "px-2 py-0.5 text-xs gap-1",
    md: "px-2.5 py-1 text-sm gap-1.5",
    lg: "px-3 py-1.5 text-base gap-2",
  };

  const iconSizes: Record<ChipSize, string> = {
    sm: "w-3 h-3",
    md: "w-3.5 h-3.5",
    lg: "w-4 h-4",
  };

  const getVariantStyle = (): string => {
    if (variant === "default") return colors[color];
    const variantStyles = variants[variant];
    if (typeof variantStyles === "string") return variantStyles;
    return variantStyles[color] || colors[color];
  };

  const baseStyles = `
    inline-flex items-center justify-center
    font-medium rounded-full border
    transition-all duration-200 ease-in-out
    select-none whitespace-nowrap
  `;

  const interactiveStyles =
    onClick && !disabled ? "cursor-pointer active:scale-95" : "";

  const disabledStyles = disabled
    ? "opacity-50 cursor-not-allowed pointer-events-none"
    : "";

  return (
    <span
      onClick={!disabled ? onClick : undefined}
      className={`
        ${baseStyles}
        ${sizes[size]}
        ${getVariantStyle()}
        ${interactiveStyles}
        ${disabledStyles}
        ${className}
      `}
    >
      {Icon && <Icon className={iconSizes[size]} />}

      {children}

      {removable && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
          disabled={disabled}
          className={`
            ${iconSizes[size]}
            rounded-full ml-0.5
            hover:bg-black/10 
            transition-colors duration-150
            flex items-center justify-center
          `}
        >
          <LuX className={iconSizes[size]} />
        </button>
      )}
    </span>
  );
};

export default Chip;