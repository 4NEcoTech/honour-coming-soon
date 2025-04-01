'use client';

import { Badge } from '@/components/ui/badge';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import * as React from 'react';
import { useFormContext } from 'react-hook-form';

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = 'Select items',
  className,
  badgeClassName,
  error,
  id,
}) {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');

  // Flatten all options for badge display
  const allOptions = React.useMemo(() => {
    return options.flatMap((category) => category.specializations);
  }, [options]);

  const handleUnselect = (item) => {
    onChange(selected.filter((i) => i !== item));
  };

  const handleSelect = (value) => {
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div
            id={id}
            role="combobox"
            aria-expanded={open}
            className={cn(
              'flex min-h-10 w-full flex-wrap items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
              error && 'border-destructive ring-destructive',
              className
            )}
            onClick={() => setOpen(!open)}>
            <div className="flex flex-wrap gap-1">
              {selected.length > 0 ? (
                selected.map((item) => {
                  const selectedOption = allOptions.find(
                    (option) => option.value === item
                  );
                  return (
                    <Badge
                      key={item}
                      variant="secondary"
                      className={cn(
                        'flex items-center gap-1 px-2 py-1',
                        badgeClassName
                      )}>
                      {selectedOption?.label}
                      <button
                        type="button"
                        className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleUnselect(item);
                          }
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleUnselect(item);
                        }}>
                        <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                        <span className="sr-only">
                          Remove {selectedOption?.label}
                        </span>
                      </button>
                    </Badge>
                  );
                })
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </div>
            <div className="flex shrink-0 opacity-50 self-center">
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4">
                <path
                  d="M4.93179 5.43179C4.75605 5.60753 4.75605 5.89245 4.93179 6.06819C5.10753 6.24392 5.39245 6.24392 5.56819 6.06819L7.49999 4.13638L9.43179 6.06819C9.60753 6.24392 9.89245 6.24392 10.0682 6.06819C10.2439 5.89245 10.2439 5.60753 10.0682 5.43179L7.81819 3.18179C7.73379 3.0974 7.61933 3.04999 7.49999 3.04999C7.38064 3.04999 7.26618 3.0974 7.18179 3.18179L4.93179 5.43179ZM10.0682 9.56819C10.2439 9.39245 10.2439 9.10753 10.0682 8.93179C9.89245 8.75606 9.60753 8.75606 9.43179 8.93179L7.49999 10.8636L5.56819 8.93179C5.39245 8.75606 5.10753 8.75606 4.93179 8.93179C4.75605 9.10753 4.75605 9.39245 4.93179 9.56819L7.18179 11.8182C7.26618 11.9026 7.38064 11.95 7.49999 11.95C7.61933 11.95 7.73379 11.9026 7.81819 11.8182L10.0682 9.56819Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"></path>
              </svg>
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Search specializations..."
              value={searchValue}
              onValueChange={setSearchValue}
            />
            <CommandList className="max-h-[300px] overflow-auto">
              <CommandEmpty>No specializations found.</CommandEmpty>
              {options.map((categoryOption, index) => {
                // Filter specializations based on search
                const filteredSpecializations =
                  categoryOption.specializations.filter((spec) =>
                    spec.label.toLowerCase().includes(searchValue.toLowerCase())
                  );

                // Skip rendering this category if no specializations match the search
                if (filteredSpecializations.length === 0) return null;

                return (
                  <React.Fragment key={categoryOption.category}>
                    {index > 0 && <CommandSeparator />}
                    <CommandGroup heading={categoryOption.category}>
                      {filteredSpecializations.map((option) => {
                        const isSelected = selected.includes(option.value);
                        return (
                          <CommandItem
                            key={option.value}
                            value={option.value}
                            onSelect={() => handleSelect(option.value)}>
                            <div
                              className={cn(
                                'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                                isSelected
                                  ? 'bg-primary text-primary-foreground'
                                  : 'opacity-50 [&_svg]:invisible'
                              )}>
                              <svg
                                className="h-3 w-3"
                                fill="none"
                                viewBox="0 0 15 15"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                  d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
                                  fill="currentColor"
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                            {option.label}
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </React.Fragment>
                );
              })}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {/* {error && (
        <p className="text-sm font-medium text-destructive mt-2">{error}</p>
      )} */}
    </div>
  );
}

// Form-integrated version of MultiSelect
export function FormMultiSelect({
  name,
  label,
  options,
  placeholder,
  description,
  className,
}) {
  const form = useFormContext();

  if (!form) {
    throw new Error('FormMultiSelect must be used within a FormProvider');
  }

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={className}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <MultiSelect
              id={field.name}
              options={options}
              selected={field.value || []}
              onChange={field.onChange}
              placeholder={placeholder}
              error={fieldState.error?.message}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
