import { LabelEditInfo } from "@/types/LabelEditor";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";

export function LabelEditor({ labelEdit }: { labelEdit: LabelEditInfo }) {
  const [label, setLabel] = useState<string>(labelEdit.label.split(" ")[0]);

  return (
    <div
      style={{
        position: "absolute",
        top: `${labelEdit.y}px`, // Aparece encima del nodo
        left: `${labelEdit.x}px`,
        background: "white",
        color: "black",
        padding: "8px",
        border: "1px solid black",
        borderRadius: "4px",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        transform: "translate(0%, -100%)", // Centra el tooltip sobre el nodo
        zIndex: 1000,
      }}
      className="flex flex-col gap-y-2"
    >
      <label className="text-sm text-center">
        Modificar Velocidad del cable
      </label>
      <div className="flex flex-row items-center gap-x-4">
        <Input
          className="w-[70%]"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
        <h1 className="w-[10%]">Mbps</h1>
      </div>
      <Button onClick={() => labelEdit.onChange(`${label} Mbps`)}>
        Guardar
      </Button>
      <Button
        className="absolute -top-6 -right-6"
        variant={"destructive"}
        onClick={labelEdit.onClose}
      >
        &times;
      </Button>
    </div>
  );
}
