"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const TableSkeleton = ({ rows = 5, columns = 5, hasHeader = true }) => (
  <div className="w-full overflow-hidden rounded-lg shadow-md">
    <table className="w-full border-collapse">
      {hasHeader && (
        <thead>
          <tr className="bg-gray-100">
            {Array.from({ length: columns }).map((_, idx) => (
              <th key={idx} className="border border-gray-200 p-2">
                <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
              </th>
            ))}
          </tr>
        </thead>
      )}
      <tbody>
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <tr key={rowIdx} className="text-center">
            {Array.from({ length: columns }).map((_, colIdx) => (
              <td key={colIdx} className="border border-gray-200 p-2">
                <div className="h-5 bg-gray-200 rounded animate-pulse"></div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const ListSkeleton = ({ items = 5, lines = 5 }) => (
  <div className="space-y-4">
    {Array.from({ length: items }).map((_, itemIdx) => (
      <div key={itemIdx} className="border border-gray-200 p-4 rounded-lg">
        {Array.from({ length: lines }).map((_, lineIdx) => (
          <div
            key={lineIdx}
            className={`h-5 bg-gray-200 rounded animate-pulse mb-2 ${
              lineIdx === 0
                ? "w-1/3"
                : lineIdx === lines - 1
                ? "w-1/4"
                : "w-full"
            }`}
          ></div>
        ))}
      </div>
    ))}
  </div>
);

const PaginatedDataTable = ({
  data = [],
  isLoading = false,
  paginationInfo = {},
  goToPage = () => {},
  searchText = "",
  setSearchText = () => {},
  viewMode = "table",
  setViewMode = () => {},
  columns = [],
  title = "Data",
  onRowClick,
  onExport,
  showExport = false,
  showColumnCustomization = true,
  showViewToggle = true,
  searchPlaceholder = "Search...",
  leftIconSrc = "/image/institutndashboard/dashpage/student/search.svg",
  rightIconSrc = "/image/institute/EducationalInstitute/filter.svg",
}) => {
  const [selectedColumns, setSelectedColumns] = useState(
    columns.reduce((acc, col) => {
      acc[col.key] = col.visible !== false;
      return acc;
    }, {})
  );

  const handleColumnToggle = (column) => {
    setSelectedColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  const formattedSubtitle = `${title} - Page ${paginationInfo.currentPage ?? 1} of ${paginationInfo.totalPages ?? 1}`;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-primary">{formattedSubtitle}</p>

      <div className="flex items-center mt-4">
        <div className="relative flex-grow mr-4">
          <div className="absolute inset-y-0 left-4 flex items-center">
            <Image src={leftIconSrc} alt="Search Icon" width={20} height={20} className="w-5 h-5" />
          </div>

          <Input
            type="text"
            placeholder={searchPlaceholder}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="flex-grow pl-12 pr-12 py-4 text-lg rounded-full border-2 border-primary focus:ring focus:ring-primary"
          />

          {rightIconSrc && (
            <div className="absolute inset-y-0 right-4 flex items-center">
              <Image src={rightIconSrc} alt="Filter Icon" width={20} height={20} className="w-5 h-5" />
            </div>
          )}
        </div>

        {showColumnCustomization && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="ml-auto bg-green-500 hover:bg-green-500 hover:text-gray-100">
                Customize Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Choose Columns</DropdownMenuLabel>
              {columns.map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.key}
                  className="capitalize"
                  checked={selectedColumns[column.key]}
                  onCheckedChange={() => handleColumnToggle(column.key)}
                >
                  {column.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {showExport && (
          <button
            className="bg-primary text-white py-2 px-4 rounded ml-4 hover:bg-[#77C6FA] hover:text-primary"
            onClick={onExport}
          >
            Export to Excel
          </button>
        )}
      </div>

      {isLoading ? (
        viewMode === "table" ? (
          <TableSkeleton rows={5} columns={columns.filter((col) => selectedColumns[col.key]).length + 1} />
        ) : (
          <ListSkeleton items={5} lines={5} />
        )
      ) : data.length > 0 ? (
        viewMode === "table" ? (
          <table className="table-auto w-full border-collapse border border-gray-300 mt-4">
            <thead>
              <tr className="bg-gray-100">
                {columns.filter((column) => selectedColumns[column.key]).map((column) => (
                  <th key={column.key} className="border border-gray-300 p-2">
                    {column.label}
                  </th>
                ))}
                <th className="border border-gray-300 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, idx) => (
                <tr key={idx} onClick={() => onRowClick?.(item)}>
                  {columns.filter((col) => selectedColumns[col.key]).map((col) => (
                    <td key={col.key} className="border border-gray-300 p-2">
                      {item[col.key] ?? "-"}
                    </td>
                  ))}
                  <td className="border border-gray-300 p-2">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRowClick?.(item);
                      }}
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="mt-4">
            {data.map((item, idx) => (
              <div
                key={idx}
                className="border p-4 mb-2 rounded"
                onClick={() => onRowClick?.(item)}
              >
                {columns.filter((col) => selectedColumns[col.key]).map((col) => (
                  <p key={col.key}>
                    <strong>{col.label}:</strong> {item[col.key] ?? "-"}
                  </p>
                ))}
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="text-center py-8 text-gray-500">No data found</div>
      )}

      <div className="flex justify-between items-center mt-8">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                className="text-primary"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  goToPage?.((paginationInfo?.currentPage ?? 1) - 1);
                }}
                style={{ opacity: (paginationInfo?.currentPage ?? 1) === 1 ? 0.5 : 1 }}
              />
            </PaginationItem>

            {Array.from(
              {
                length:
                  (paginationInfo?.batchEndPage ?? 1) -
                  (paginationInfo?.batchStartPage ?? 1) +
                  1,
              },
              (_, idx) => (paginationInfo?.batchStartPage ?? 1) + idx
            ).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  isActive={page === (paginationInfo?.currentPage ?? 1)}
                  onClick={(e) => {
                    e.preventDefault();
                    goToPage?.(page);
                  }}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                className="text-primary"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  goToPage?.((paginationInfo?.currentPage ?? 1) + 1);
                }}
                style={{
                  opacity:
                    (paginationInfo?.currentPage ?? 1) ===
                    (paginationInfo?.totalPages ?? 1)
                      ? 0.5
                      : 1,
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>

        {showViewToggle && (
          <button
            onClick={() => setViewMode(viewMode === "table" ? "list" : "table")}
            className="w-48 h-10 border-2 border-primary rounded-full flex items-center justify-between shadow-md"
          >
            <span
              className={`flex-1 text-center py-2 rounded-full ${
                viewMode === "table"
                  ? "bg-primary text-white"
                  : "bg-transparent text-primary"
              }`}
            >
              Table View
            </span>
            <span
              className={`flex-1 text-center py-2 rounded-full ${
                viewMode === "list"
                  ? "bg-primary text-white"
                  : "bg-transparent text-primary"
              }`}
            >
              List View
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default PaginatedDataTable;
