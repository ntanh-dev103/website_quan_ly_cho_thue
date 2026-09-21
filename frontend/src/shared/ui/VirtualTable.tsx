import React, { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

interface Column<T> {
  header: string;
  accessorKey: keyof T;
  cell?: (item: T) => React.ReactNode;
  width?: string;
}

interface VirtualTableProps<T> {
  data: T[];
  columns: Column<T>[];
  rowHeight?: number;
  className?: string;
}

export function VirtualTable<T>({ 
  data, 
  columns, 
  rowHeight = 50, 
  className = '' 
}: VirtualTableProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight,
    overscan: 5, // Render thêm 5 rows ở trên/dưới để tránh giật lag khi cuộn nhanh
  });

  return (
    <div 
      ref={parentRef} 
      className={`overflow-auto border border-gray-200 rounded-xl bg-white ${className}`}
      style={{ maxHeight: '600px' }} // Chiều cao tối đa của vùng cuộn
    >
      <table className="w-full text-sm text-left relative">
        <thead className="bg-gray-50 sticky top-0 z-10 shadow-[0_1px_0_0_rgba(229,231,235,1)]">
          <tr>
            {columns.map((col, index) => (
              <th 
                key={index} 
                className="py-3 px-4 font-semibold text-gray-600"
                style={{ width: col.width }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const item = data[virtualRow.index];
            return (
              <tr
                key={virtualRow.index}
                className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors absolute w-full"
                style={{
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="py-2 px-4 truncate">
                    {col.cell ? col.cell(item) : String(item[col.accessorKey])}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
