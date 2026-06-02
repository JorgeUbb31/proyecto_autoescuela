import '../styles/modal.css'

export default function Modal({ isOpen, title, children, onClose }) {
  if (!isOpen) return null

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div className="modal-content animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  )
}
