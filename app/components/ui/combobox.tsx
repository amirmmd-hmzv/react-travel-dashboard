"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Button } from "./button";
import { cn } from "lib/utils";

export interface ComboboxItem {
  value: string;
  label: string;
  icon?: LucideIcon;
  imgIcon?: string;
  disabled?: boolean;
}

export interface ComboboxTexts {
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
}

export type FilterMode = "exact" | "startsWith" | "fuzzy";

export interface ComboboxProps {
  items: ComboboxItem[];
  value?: string;
  onChange?: (value: string) => void;
  texts?: ComboboxTexts;
  icon?: LucideIcon;
  checkIcon?: LucideIcon;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  filterMode?: FilterMode;
  selectedTextClassName?: string;
  searchable?: boolean; // 👈 اضافه شد
  loading: boolean;
}

export function Combobox({
  loading,
  items,
  value: controlledValue,
  onChange,
  texts = {},
  icon: TriggerIcon = ChevronsUpDown,
  checkIcon: CheckIcon = Check,
  disabled = false,
  className,
  triggerClassName,
  contentClassName,
  selectedTextClassName,
  filterMode = "startsWith",
  searchable = true,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState("");

  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const [triggerWidth, setTriggerWidth] = React.useState<number>(0);

  React.useEffect(() => {
    if (!triggerRef.current) return;

    const updateWidth = () => {
      if (triggerRef.current) {
        setTriggerWidth(triggerRef.current.offsetWidth);
      }
    };

    updateWidth();

    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(triggerRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const selectedItem = items.find((item) => item.value === value);

  const handleSelect = (currentValue: string) => {
    const newValue = currentValue === value ? "" : currentValue;

    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }

    onChange?.(newValue);
    setOpen(false);
  };

  const customFilter = React.useCallback(
    (value: string, search: string, keywords?: string[]) => {
      const itemLabel =
        items.find((item) => item.value === value)?.label || value;
      const searchLower = search.toLowerCase();
      const labelLower = itemLabel.toLowerCase();

      switch (filterMode) {
        case "startsWith":
          return labelLower.startsWith(searchLower) ? 1 : 0;

        case "exact":
          return labelLower.includes(searchLower) ? 1 : 0;

        case "fuzzy":
        default:
          return undefined as any;
      }
    },
    [filterMode, items]
  );

  const {
    placeholder = "Select...",
    searchPlaceholder = "Search...",
    emptyMessage = "No results found.",
  } = texts;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={triggerRef}
          variant="secondary"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "min-w-50 justify-between",
            triggerClassName,
            className
          )}
        >
          <span
            className={cn(
              "flex items-center gap-2 truncate",
              selectedTextClassName
            )}
          >
            {selectedItem?.imgIcon && (
              <img
                src={selectedItem.imgIcon}
                alt={selectedItem.label}
                className="h-4 w-6 rounded-sm object-cover shrink-0"
              />
            )}
            {selectedItem?.icon && (
              <selectedItem.icon className="h-4 w-4 shrink-0" />
            )}
            {selectedItem?.label || placeholder}
          </span>
          <TriggerIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        style={{ width: triggerWidth > 0 ? triggerWidth : undefined }}
        className={cn("p-0", contentClassName)}
      >
        <Command
          filter={
            !loading && searchable && filterMode !== "fuzzy"
              ? customFilter
              : undefined
          }
        >
          {/* Search */}
          {!loading && searchable && (
            <CommandInput placeholder={searchPlaceholder} className="h-9" />
          )}

          <CommandList>
            {loading ? (
              <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading items...
              </div>
            ) : (
              <>
                <CommandEmpty>{emptyMessage}</CommandEmpty>

                <CommandGroup>
                  {items.map((item) => {
                    const ItemIcon = item.icon;
                    return (
                      <CommandItem
                        key={item.value}
                        value={item.value}
                        keywords={[item.label]}
                        disabled={item.disabled}
                        onSelect={handleSelect}
                      >
                        {item.imgIcon && (
                          <img
                            src={item.imgIcon}
                            alt={item.label}
                            className="mr-2 h-4 w-6 rounded-sm object-cover shrink-0"
                          />
                        )}
                        {ItemIcon && (
                          <ItemIcon className="mr-2 h-4 w-4 shrink-0" />
                        )}
                        {item.label}
                        <CheckIcon
                          className={cn(
                            "ml-auto h-4 w-4",
                            value === item.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
