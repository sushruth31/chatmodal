import React from "react";

export default function ModalBackDrop({ children, onClick }) {
  return (
    <div onClick={onClick} className="modalbackdrop">
      {children}
    </div>
  );
}
