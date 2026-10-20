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
      style={{ maxHeight: '600px' }}
    >
      <div className="w-full text-sm text-left min-w-[720px]">
        {/* Table Header */}
        <div className="bg-gray-50/90 backdrop-blur-xs sticky top-0 z-10 border-b border-gray-200 flex w-full">
          {columns.map((col, index) => (
            <div 
              key={index} 
              className="py-3.5 px-4 font-semibold text-gray-700 shrink-0 select-none flex items-center"
              style={{ width: col.width || `${100 / columns.length}%` }}
            >
              {col.header}
            </div>
          ))}
        </div>

        {/* Table Body */}
        {data.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs">
            Không có dữ liệu hiển thị
          </div>
        ) : (
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              position: 'relative',
              width: '100%',
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const item = data[virtualRow.index];
              return (
                <div
                  key={virtualRow.index}
                  className="border-b border-gray-100 hover:bg-slate-50/70 transition-colors absolute top-0 left-0 w-full flex items-center"
                  style={{
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  {columns.map((col, colIndex) => (
                    <div 
                      key={colIndex} 
                      className="py-2.5 px-4 shrink-0 flex items-center overflow-hidden"
                      style={{ width: col.width || `${100 / columns.length}%` }}
                    >
                      {col.cell ? col.cell(item) : (
                        <span className="truncate">{String(item[col.accessorKey] ?? '')}</span>
                      )}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
