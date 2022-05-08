import React from "react";
import ReactDOM from "react-dom";

export const Modal = React.forwardRef(
  ({ children, onKeyDown, closeModal }, ref) => {
    const { modalRef, closeBtnRef } = ref.current;
    return ReactDOM.createPortal(
      <aside
        tag="aside"
        role="dialog"
        tabIndex="-1"
        aria-modal="true"
        className="modal-overlay"
        onKeyDown={onKeyDown}
      >
        <div className="modal" ref={modalRef}>
          <button
            ref={closeBtnRef}
            aria-label="Close Modal"
            aria-labelledby="close-modal"
            className="modal-close"
            onClick={closeModal}
          >
            <span className="hide-visual">Close</span>
            <svg className="modal-close__icon" viewBox="0 0 40 40">
              <path d="M 10,10 L 30,30 M 30,10 L 10,30" />
            </svg>
          </button>
          <div className="modal-body">{children}</div>
        </div>
      </aside>,
      document.body
    );
  }
);

export default Modal;
