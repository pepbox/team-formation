import React from "react";

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

const CustomTable: React.FC<CustomTableProps> = ({
  columns,
  data,
  keyField,
}) => {
  const getNestedValue = (obj: Record<string, any>, path: string): any => {
    return path.split(".").reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
  };

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

  return (
    <div className="w-full bg-white rounded-lg">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] sm:min-w-0 hidden sm:table">
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
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
          {data.map((row, rowIndex) => (
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
