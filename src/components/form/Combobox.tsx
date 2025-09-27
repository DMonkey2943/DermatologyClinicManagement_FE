"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface Option {
  value: string
  label: string
}

interface ComboboxProps {
  options: Option[]
  placeholder?: string
  onChange: (value: string) => void
  className?: string
  defaultValue?: string
  disabled?: boolean
}

export function Combobox({
  options,
  placeholder = "Select an option...",
  onChange,
  className = "",
  defaultValue = "",
  disabled = false,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState(defaultValue)

    React.useEffect(() => {
        setValue(defaultValue);
    }, [defaultValue]);

  const handleSelect = (currentValue: string) => {
    // console.log("Combobox handleSelct - currentValue: ", currentValue)
    const newValue = currentValue === value ? "" : currentValue
    setValue(newValue)
    onChange(newValue)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "h-11 w-full justify-between rounded-lg border border-gray-300 px-4 py-2.5 pr-11 text-sm shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90",
            value ? "text-gray-800 dark:text-white/90" : "text-gray-400 dark:text-gray-400",
            className
          )}
        >
          {value
            ? options.find((option) => option.value === value)?.label
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          "w-full p-0 z-50000000 rounded-lg border border-gray-300 bg-white shadow-theme-xs dark:border-gray-700 dark:bg-gray-900",
          className
        )}
      >
        <Command
            filter={(value, search) => {
                const option = options.find((opt) => opt.value === value);
                if (!option) return 0;
                return option.label.toLowerCase().includes(search.toLowerCase()) ? 1 : 0;
            }}
        >
          <CommandInput placeholder={placeholder} className="h-9" />
          <CommandList>
            <CommandEmpty>No option found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={handleSelect}
                  className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                >
                  {option.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default Combobox