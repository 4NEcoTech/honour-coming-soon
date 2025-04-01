"use client"
import { Skeleton } from "@/components/ui/skeleton"

/**
 * Reusable data list component with skeleton loading
 * @param {Object} props Component props
 * @param {Array} props.data Data to display in the list
 * @param {Array} props.fields Field definitions
 * @param {Function} props.onItemClick Function to call when an item is clicked
 * @param {boolean} props.isLoading Whether the data is loading
 * @param {string} props.className Additional CSS classes
 */
export function DataList({ data, fields, onItemClick, isLoading = false, className = "" }) {
  if (isLoading) {
    return (
      <div className="mt-4 space-y-4">
        {[1, 2, 3].map((_, index) => (
          <div key={index} className="border border-gray-300 p-4 rounded">
            {fields.map((_, fieldIndex) => (
              <div key={fieldIndex} className="mb-2">
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ))}
      </div>
    )
  }

  if (data.length === 0) {
    return <div className="text-center py-8 text-gray-500">No data found</div>
  }

  return (
    <div className={`mt-4 space-y-4 ${className}`}>
      {data.map((item, index) => (
        <div
          key={index}
          className={`border border-gray-300 p-4 rounded ${onItemClick ? "cursor-pointer hover:bg-gray-50" : ""}`}
          onClick={() => onItemClick && onItemClick(item)}
        >
          {fields.map((field) => (
            <p key={field.key} className="mb-2">
              <strong>{field.label}:</strong> {field.render ? field.render(item) : item[field.key] || "-"}
            </p>
          ))}
        </div>
      ))}
    </div>
  )
}

