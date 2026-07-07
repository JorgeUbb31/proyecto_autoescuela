import Modal from './Modal.jsx'

export default function DeleteConfirmationModal({
  isOpen,
  title = 'Confirmar eliminación',
  message = '¿Estás seguro de que deseas eliminar este elemento?',
  resourceName = 'este elemento',
  onConfirm,
  onCancel,
  isLoading = false,
}) {
  if (!isOpen) return null

  return (
    <Modal isOpen={isOpen} title={title} onClose={onCancel}>
      <div className="space-y-4">
        <p className="text-gray-700">
          {message || `¿Estás seguro de que deseas eliminar ${resourceName}?`}
        </p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
