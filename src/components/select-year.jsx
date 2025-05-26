"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";

export function YearSelect({
  value,
  onChange,
  startYear,
  endYear,
  label = "",
  placeholder = "Select year",
  disabled = false,
  className = "",
  control,
  name,
}) {
  const [selectedYear, setSelectedYear] = useState(value);
  const [yearOptions, setYearOptions] = useState([]);

  // Generate year options based on provided range or default to past 100 years
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const start = startYear ?? currentYear - 100;
    const end = endYear ?? currentYear;

    // Create array of years in descending order (newest first)
    const years = Array.from({ length: end - start + 1 }, (_, i) => end - i);

    setYearOptions(years);
  }, [startYear, endYear]);

  // Update internal state when external value changes
  useEffect(() => {
    setSelectedYear(value);
  }, [value]);

  const handleYearChange = (yearStr) => {
    const year = Number.parseInt(yearStr, 10);
    setSelectedYear(value);
    onChange?.(year);
  };

  // If using with React Hook Form
  if (control && name) {
    return (
      <div className={className}>
        {label && (
          <label className="block text-sm font-medium mb-1">{label}</label>
        )}
        <Controller
          control={control}
          name={name}
          render={({ field }) => (
            <Select
              value={field.value?.toString()}
              onValueChange={(value) => field.onChange(value)}
              disabled={disabled}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {yearOptions.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>
    );
  }

  // Standard usage without React Hook Form
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium mb-1">{label}</label>
      )}
      <Select
        value={selectedYear?.toString()}
        onValueChange={handleYearChange}
        disabled={disabled}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {yearOptions.map((year) => (
            <SelectItem key={year} value={year.toString()}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
