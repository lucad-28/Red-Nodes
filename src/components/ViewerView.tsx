import { useRef, useState } from "react";
import { DEVICES_VIEWER_MOCKUP } from "../types/Device";
import { NodeNetwork } from "./NodeNetwork";
import { TooltipInfo } from "../types/Tooltipinfo";
import { Edge, Network, Node } from "vis-network";
import { DataSet } from "vis-data";
import { Tooltip } from "./Tooltip";

export function ViewerView() {
  const [tooltip, setTooltip] = useState<TooltipInfo | null>(null);
  const nodes_ = useRef<DataSet<Node>>(new DataSet());
  const edges_ = useRef<DataSet<Edge>>(new DataSet());
  const handleSelectNode = (params: { nodes: string[] }, network: Network) => {
    if (params.nodes.length > 0) {
      console.log(params.nodes);
      const nodeId = params.nodes[0]; // ID del nodo clickeado
      const all_nodes = nodes_.current.get(); // Información del nodo

      const node = all_nodes.find((n) => n.id === nodeId); // Buscar el nodo en la lista

      if (node) {
        const position = network.getPositions(nodeId); // Posición del nodo en el canvas
        const canvasPosition = network.canvasToDOM(position[nodeId]); // Convertir a coordenadas del DOM

        setTooltip({
          id: node.id,
          label: node.label as string,
          x: canvasPosition.x,
          y: canvasPosition.y,
        });
      }
    } else {
      setTooltip(null); // Cierra el cuadro si no se selecciona un nodo
    }
  };

  return (
    <div className="w-full h-full relative">
      <NodeNetwork
        devices={DEVICES_VIEWER_MOCKUP}
        onSelectNode={handleSelectNode}
        nodes={nodes_.current}
        edges={edges_.current}
      />
      {tooltip && <Tooltip tooltip={tooltip} />}
    </div>
  );
}
