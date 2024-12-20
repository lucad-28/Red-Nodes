import {
  PlusCircle,
  Trash2,
  Edit,
  LucideProps,
  TrashIcon,
  PlusSquareIcon,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { EditorMenuInfo } from "@/types/EditorMenuInfo";

interface Action {
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  name: string;
  id:
    | "editConnection"
    | "addConnection"
    | "deleteConnection"
    | "deleteChildrens"
    | "editHosts"
    | "addChildren";
}

const actions: Action[] = [
  { icon: Edit, name: "Modificar conexión", id: "editConnection" },
  { icon: Trash2, name: "Eliminar conexión", id: "deleteConnection" },
  { icon: PlusCircle, name: "Agregar conexión", id: "addConnection" },
  { icon: TrashIcon, name: "Eliminar dispositivos", id: "deleteChildrens" },
  { icon: Edit, name: "Editar hosts", id: "editHosts" },
  { icon: PlusSquareIcon, name: "Agregar dispositivo", id: "addChildren" },
];

export function EditorMenu({ menuEdit }: { menuEdit: EditorMenuInfo }) {
  return (
    <TooltipProvider>
      <div
        className="flex space-x-4 p-2 bg-white rounded-lg shadow"
        style={{
          position: "absolute",
          top: `${menuEdit.y - 20}px`, // Aparece encima del nodo
          left: `${menuEdit.x}px`,
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          transform: "translate(-50%, -100%)", // Centra el tooltip sobre el nodo
          zIndex: 10,
        }}
      >
        {Array.from(actions.filter((action) => menuEdit.handle[action.id])).map(
          (action, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Button
                  onClick={menuEdit.handle[action.id]}
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10"
                >
                  <action.icon className="h-6 w-6" />
                  <span className="sr-only">{action.name}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{action.name}</p>
              </TooltipContent>
            </Tooltip>
          )
        )}
      </div>
    </TooltipProvider>
  );
}
