export default function Table({ columns, data, onEdit, onDelete, renderActions, loading }) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Asegurar que data es un array
  const dataArray = Array.isArray(data) ? data : []

  if (!dataArray || dataArray.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <p className="text-gray-600 text-lg">No hay datos para mostrar</p>
      </div>
    )
  }

  const showActionsColumn = onEdit || onDelete || renderActions

  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
      <table className="w-full bg-white">
        <thead className="bg-primary text-white">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="px-6 py-4 text-left font-semibold">
                {column.label}
              </th>
            ))}
            {showActionsColumn && (
              <th className="px-6 py-4 text-center font-semibold">Acciones</th>
            )}
          </tr>
        </thead>
        <tbody>
          {dataArray.map((row, idx) => (
            <tr
              key={row.id || idx}
              className="border-b border-gray-200 hover:bg-beige-50 transition-colors duration-200"
            >
              {columns.map((column) => (
                <td key={`${row.id}-${column.key}`} className="px-6 py-4 text-gray-900">
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
              {showActionsColumn && (
                <td className="px-6 py-4 text-center">
                  <div className="flex flex-wrap justify-center gap-2">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(row)}
                        className="px-3 py-1 bg-secondary text-white rounded hover:bg-primary transition-colors duration-200 text-sm font-semibold"
                      >
                        Editar
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(row)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200 text-sm font-semibold"
                      >
                        Eliminar
                      </button>
                    )}
                    {renderActions && renderActions(row)}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
