import React, { useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "../ApperIcon";
import Button from "../atoms/Button";
import StatusBadge from "../atoms/StatusBadge";

const DataTable = ({ 
  columns, 
  data = [], 
  loading = false, 
  onRowClick,
  actions = []
}) => {
  const [sortConfig, setSortConfig] = useState(null);

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    if (!sortConfig) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  const renderCellContent = (item, column) => {
    const value = item[column.key];
    
    if (column.render) {
      return column.render(value, item);
    }
    
    if (column.type === 'status') {
      return <StatusBadge status={value} />;
    }
    
    if (column.type === 'date') {
      return new Date(value).toLocaleDateString();
    }
    
    if (column.type === 'currency') {
      return `$${parseFloat(value || 0).toFixed(2)}`;
    }
    
    return value || '-';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-surface-200 overflow-hidden">
        <div className="animate-pulse">
          <div className="border-b border-surface-200 p-4">
            <div className="flex gap-4">
              {columns.map((_, index) => (
                <div key={index} className="h-4 bg-surface-200 rounded flex-1"></div>
              ))}
            </div>
          </div>
          {[...Array(5)].map((_, index) => (
            <div key={index} className="border-b border-surface-200 p-4">
              <div className="flex gap-4">
                {columns.map((_, colIndex) => (
                  <div key={colIndex} className="h-4 bg-surface-200 rounded flex-1"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-surface-200 overflow-hidden overflow-x-auto">
      <table className="w-full">
        <thead className="bg-surface-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`
                  px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider
                  ${column.sortable ? 'cursor-pointer hover:bg-surface-100' : ''}
                `.trim()}
                onClick={column.sortable ? () => handleSort(column.key) : undefined}
              >
                <div className="flex items-center gap-2">
                  {column.title}
                  {column.sortable && (
                    <ApperIcon
                      name={
                        sortConfig?.key === column.key
                          ? sortConfig.direction === 'ascending'
                            ? 'ChevronUp'
                            : 'ChevronDown'
                          : 'ChevronsUpDown'
                      }
                      size={14}
                      className="text-surface-400"
                    />
                  )}
                </div>
              </th>
            ))}
            {actions.length > 0 && (
              <th className="px-6 py-3 text-right text-xs font-medium text-surface-500 uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-surface-200">
          {sortedData.map((item, index) => (
            <motion.tr
              key={item.Id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`
                hover:bg-surface-50 transition-colors
                ${onRowClick ? 'cursor-pointer' : ''}
              `.trim()}
              onClick={() => onRowClick?.(item)}
            >
              {columns.map((column) => (
                <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-surface-900">
                  {renderCellContent(item, column)}
                </td>
              ))}
              {actions.length > 0 && (
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    {actions.map((action, actionIndex) => (
                      <Button
                        key={actionIndex}
                        variant="ghost"
                        size="sm"
                        icon={action.icon}
                        onClick={(e) => {
                          e.stopPropagation();
                          action.onClick(item);
                        }}
                        className="text-surface-600 hover:text-surface-900"
                      >
                        {action.label}
                      </Button>
                    ))}
                  </div>
                </td>
              )}
            </motion.tr>
          ))}
        </tbody>
      </table>
      
      {sortedData.length === 0 && (
        <div className="text-center py-12">
          <ApperIcon name="FileX" size={48} className="text-surface-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-surface-900 mb-2">No data found</h3>
          <p className="text-surface-600">No records match your current criteria.</p>
        </div>
      )}
    </div>
  );
};

export default DataTable;