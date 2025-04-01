"use client"
import { Skeleton } from "@/components/ui/skeleton"

/**
 * Reusable data table component with skeleton loading
 * @param {Object} props Component props
 * @param {Array} props.data Data to display in the table
 * @param {Array} props.columns Column definitions
 * @param {Function} props.onRowClick Function to call when a row is clicked
 * @param {boolean} props.isLoading Whether the data is loading
 * @param {string} props.className Additional CSS classes
 */
export function DataTable({ data, columns, onRowClick, isLoading = false, className = "" }) {
  const visibleColumns = columns.filter((col) => col.isVisible !== false)

  if (isLoading) {
    return (
      <div className="w-full mt-4">
        <div className="flex space-x-4 mb-4">
          {visibleColumns.map((_, index) => (
            <Skeleton key={index} className="h-8 w-full" />
          ))}
        </div>
        {[1, 2, 3, 4, 5].map((_, index) => (
          <div key={index} className="flex space-x-4 mb-4">
            {visibleColumns.map((_, colIndex) => (
              <Skeleton key={colIndex} className="h-12 w-full" />
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
 
    <table className={`table-auto w-full border-collapse border border-gray-300 mt-4 ${className}`}>
      <thead>
        <tr className="bg-gray-100">
          {visibleColumns.map((column) => (
            <th key={column.key} className="border border-gray-300 p-2">
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr
            key={index}
            className={`text-center ${onRowClick ? "cursor-pointer hover:bg-gray-50" : ""}`}
            onClick={() => onRowClick && onRowClick(item)}
          >
            {visibleColumns.map((column) => (
              <td key={`${index}-${column.key}`} className="border border-gray-300 p-2">
                {column.render ? column.render(item) : item[column.key] || "-"}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>

  )
}

