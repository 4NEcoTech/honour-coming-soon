"use client"
import { Input } from "@/components/ui/input"
import Image from "next/image"

/**
 * Reusable search input component
 * @param {Object} props Component props
 * @param {string} props.value Current search value
 * @param {Function} props.onChange Function to call when search value changes
 * @param {string} props.placeholder Placeholder text
 * @param {string} props.className Additional CSS classes
 * @param {boolean} props.showFilterIcon Whether to show the filter icon
 */
export function SearchInput({ value, onChange, placeholder = "Search...", className = "", showFilterIcon = true }) {
  return (
    <div className={`relative flex-grow ${className}`}>
      <div className="absolute inset-y-0 left-4 flex items-center">
        <Image
          src="/image/institutndashboard/dashpage/student/search.svg"
          alt="Search"
          width={20}
          height={20}
          className="w-5 h-5"
        />
      </div>

      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-grow pl-12 pr-12 py-4 text-lg rounded-full border-2 border-primary focus:ring focus:ring-primary"
      />

      {showFilterIcon && (
        <div className="absolute inset-y-0 right-4 flex items-center">
          {/* <Image
            src="/image/institute/EducationalInstitute/filter.svg"
            alt="Filter"
            width={20}
            height={20}
            className="w-5 h-5"
          /> */}
        </div>
      )}
    </div>
  )
}

