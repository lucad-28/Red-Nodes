import { TooltipInfo } from "../types/Tooltipinfo";

export function Tooltip({ tooltip }: { tooltip: TooltipInfo }) {
  return (
    <div
      style={{
        position: "absolute",
        top: `${tooltip.y - 50}px`, // Aparece encima del nodo
        left: `${tooltip.x}px`,
        background: "white",
        color: "black",
        padding: "8px",
        border: "1px solid black",
        borderRadius: "4px",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        transform: "translate(-50%, -100%)", // Centra el tooltip sobre el nodo
        zIndex: 1000,
      }}
    >
      {tooltip.children}
    </div>
  );
}
