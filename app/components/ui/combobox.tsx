"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
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
  disabled?: boolean;
}

export interface ComboboxTexts {
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
}

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
}

export function Combobox({
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
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState("");
  
  // 👇 اضافه شد
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const [triggerWidth, setTriggerWidth] = React.useState<number>(0);

  // 👇 گرفتن عرض واقعی دکمه
  React.useEffect(() => {
    if (!triggerRef.current) return;

    const updateWidth = () => {
      if (triggerRef.current) {
        setTriggerWidth(triggerRef.current.offsetWidth);
      }
    };

    // گرفتن عرض اولیه
    updateWidth();

    // مشاهده تغییرات سایز
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

  const {
    placeholder = "Select...",
    searchPlaceholder = "Search...",
    emptyMessage = "No results found.",
  } = texts;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={triggerRef}  // 👈 اضافه شد
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
          <span className="flex items-center gap-2 truncate">
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
        style={{ width: triggerWidth > 0 ? triggerWidth : undefined }}  // 👈 اضافه شد
        className={cn("p-0", contentClassName)}
      >
        <Command>
          <CommandInput placeholder={searchPlaceholder} className="h-9" />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {items.map((item) => {
                const ItemIcon = item.icon;
                return (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    disabled={item.disabled}
                    onSelect={handleSelect}
                  >
                    {ItemIcon && <ItemIcon className="mr-2 h-4 w-4 shrink-0" />}
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
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}