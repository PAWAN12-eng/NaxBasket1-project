import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender
} from '@tanstack/react-table';

const DisplayTable = ({ data, columns, loading }) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="bg-white shadow rounded overflow-x-auto">
      {loading ? (
        <p className="p-4">Loading...</p>
      ) : (
        <table className="min-w-full text-sm text-left border border-gray-200">
          <thead className="bg-gray-100 hidden md:table-header-group">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="p-2 border-b font-semibold text-gray-700">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr
                key={row.id}
                className="hover:bg-gray-50 border-b border-gray-200 block md:table-row"
              >
                {row.getVisibleCells().map(cell => (
                  <td
                    key={cell.id}
                    className="p-2 block md:table-cell before:content-[attr(data-label)] md:before:content-none before:font-medium before:text-gray-500 before:mr-2"
                    data-label={cell.column.columnDef.header}
                  >
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DisplayTable;
