import React from "react";

export default function ModalBackDrop({ children, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: "100vw",
        background: "#000000bf",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9000,
      }}>
      {children}
    </div>
  );
}
