import { AddButtonInfo } from "../types/AddButtonInfo";

export function AddButton({ addButtonInfo }: { addButtonInfo: AddButtonInfo }) {
  return (
    <div
      style={{
        position: "absolute",
        top: `${addButtonInfo.y - 50}px`, // Aparece encima del nodo
        left: `${addButtonInfo.x}px`,
        background: "white",
        color: "black",
        padding: "8px",
        border: "1px solid black",
        borderRadius: "4px",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        transform: "translate(-50%, -100%)", // Centra el tooltip sobre el nodo
        zIndex: 1000,
      }}
      className="w-32 h-32 bg-black rounded-full"
      onClick={addButtonInfo.onClick}
    ></div>
  );
}
