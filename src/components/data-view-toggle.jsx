"use client"

/**
 * Toggle component for switching between table and list views
 * @param {Object} props Component props
 * @param {string} props.viewMode Current view mode ("table" or "list")
 * @param {Function} props.onToggle Function to call when view mode changes
 * @param {string} props.className Additional CSS classes
 */
export function DataViewToggle({ viewMode, onToggle, className = "" }) {
  return (
    <button
      onClick={() => onToggle(viewMode === "table" ? "list" : "table")}
      className={`w-48 h-10 border-2 border-primary rounded-full flex items-center justify-between shadow-md ${className}`}
    >
      <span
        className={`flex-1 text-center py-2 rounded-full ${
          viewMode === "table" ? "bg-primary text-white" : "bg-transparent text-primary"
        }`}
      >
        Table View
      </span>
      <span
        className={`flex-1 text-center py-2 rounded-full ${
          viewMode === "list" ? "bg-primary text-white" : "bg-transparent text-primary"
        }`}
      >
        List View
      </span>
    </button>
  )
}

