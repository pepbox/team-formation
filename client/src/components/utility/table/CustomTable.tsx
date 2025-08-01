import React, { useState, useMemo } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

interface Column {
  key: string;
  header: string;
  type?: string;
  component?: React.ComponentType<any>;
  handler?: (row: any) => void;
  componentProps?: Record<string, any>;
}

interface CustomTableProps {
  columns: Column[];
  data: Record<string, any>[];
  keyField: string;
}

type SortDirection = 'asc' | 'desc' | null;

const CustomTable: React.FC<CustomTableProps> = ({
  columns,
  data,
  keyField,
}) => {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: SortDirection;
  }>({ key: '', direction: null });

  const getNestedValue = (obj: Record<string, any>, path: string): any => {
    return path.split(".").reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
  };

  const sortData = (key: string) => {
    let direction: SortDirection = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) {
      return data;
    }

    return [...data].sort((a, b) => {
      const aValue = getNestedValue(a, sortConfig.key);
      const bValue = getNestedValue(b, sortConfig.key);

      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return sortConfig.direction === 'asc' ? 1 : -1;
      if (bValue == null) return sortConfig.direction === 'asc' ? -1 : 1;

      // Convert to string for comparison
      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();

      // Check if both are numbers
      const aNum = Number(aValue);
      const bNum = Number(bValue);
      const bothNumbers = !isNaN(aNum) && !isNaN(bNum);

      let comparison = 0;
      if (bothNumbers) {
        comparison = aNum - bNum;
      } else {
        comparison = aStr.localeCompare(bStr);
      }

      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [data, sortConfig]);

  const renderCell = (column: Column, row: Record<string, any>) => {
    if (column.type === "action" && column.component && column.handler) {
      const ActionComponent = column.component;
      const handleClick = () => {
        console.log("Action clicked for row:", row);
        console.log("Action handler:", column.handler);
        // column.handler!(row);
      };
      return (
        <ActionComponent
          onClick={handleClick}
          handler={() => column.handler!(row)}
          {...(column.componentProps || {})}
        />
      );
    }
    const value = getNestedValue(row, column.key);
    return value ? value : "_";
  };

  const getSortIcon = (columnKey: string) => {
    if (sortConfig.key !== columnKey) {
      return <ChevronUp className="w-4 h-4 text-gray-400" />;
    }
    return sortConfig.direction === 'asc' ? 
      <ChevronUp className="w-4 h-4 text-blue-600" /> : 
      <ChevronDown className="w-4 h-4 text-blue-600" />;
  };

  return (
    <div className="w-full bg-white rounded-lg">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] sm:min-w-0 hidden sm:table">
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={`px-2 sm:px-6 py-3 text-left text-xs font-medium tracking-wider cursor-pointer  ${
                    sortConfig.key === column.key ? 'text-blue-600' : 'text-gray-500'
                  }`}
                  onClick={() => sortData(column.key)}
                >
                  <div className="flex items-center gap-1">
                    {column.header}
                    {getSortIcon(column.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, rowIndex) => (
              <tr
                key={row[keyField] || rowIndex}
                className={`${rowIndex % 2 === 0 ? "bg-gray-50" : ""}`}
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-2 sm:px-6 py-3 whitespace-nowrap text-sm"
                  >
                    {renderCell(column, row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {/* Mobile view */}
        <div className="sm:hidden flex flex-col gap-4">
          {sortedData.map((row, rowIndex) => (
            <div
              key={row[keyField] || rowIndex}
              className="bg-gray-50 rounded-lg shadow p-4"
            >
              {columns.map((column, colIndex) => (
                <div key={colIndex} className="flex justify-between py-1">
                  <span className="text-xs font-medium text-gray-500">
                    {column.header}
                  </span>
                  <span className="text-sm">{renderCell(column, row)}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomTable;
