import { useEffect, useState } from "react";
import { Device } from "../types/Device";
import { NodeNetwork } from "./NodeNetwork";
import { TooltipInfo } from "../types/Tooltipinfo";
import { Edge, Network, Node } from "vis-network";
import { DataSet } from "vis-data";
import { Tooltip } from "./Tooltip";
import { BackendResponse } from "@/types/BackendResponse";
import { findNetworkByName } from "@/lib/utils";

export function ViewerView({
  nodes_,
  edges_,
  devices,
  subnets,
}: {
  nodes_: React.MutableRefObject<DataSet<Node>>;
  edges_: React.MutableRefObject<DataSet<Edge>>;
  devices: Device[];
  subnets: BackendResponse;
}) {
  const [tooltip, setTooltip] = useState<TooltipInfo | null>(null);
  const handleClick = (params: {
    nodes: string[];
    edges: string[];
    pointer: {
      DOM: { x: number; y: number };
      canvas: { x: number; y: number };
    };
  }) => {
    if (params.nodes.length > 0) {
      return;
    }

    if (params.edges.length === 1) {
      return;
    }

    setTooltip(null);
  };

  const handleSelectNode = (params: { nodes: string[] }, network: Network) => {
    if (params.nodes.length > 0) {
      const nodeId = params.nodes[0]; // ID del nodo clickeado
      const all_nodes = nodes_.current.get(); // Información del nodo

      const node = all_nodes.find((n) => n.id === nodeId); // Buscar el nodo en la lista

      if (node) {
        const position = network.getPositions(nodeId); // Posición del nodo en el canvas
        const canvasPosition = network.canvasToDOM(position[nodeId]); // Convertir a coordenadas del DOM

        if (String(node.id).includes("host")) {
          const parent = String(node.id).substring(
            0,
            String(node.id).lastIndexOf("-")
          );
          const subnet = findNetworkByName(subnets.router, parent);
          if (!subnet) return;
          const gateway = subnet.substring(0, subnet.lastIndexOf(".") + 1);

          setTooltip({
            children: (
              <>
                <h1>Nombre: {node.id}</h1>
                <p>Gateway: {gateway}</p>
                <p>Subred: {subnet}</p>
              </>
            ),
            x: canvasPosition.x,
            y: canvasPosition.y,
          });

          return;
        }

        const subnet = findNetworkByName(subnets.router, String(node.id));

        setTooltip({
          children: (
            <>
              <h1>{node.id}</h1>
              <p>{subnet}</p>
            </>
          ),
          x: canvasPosition.x,
          y: canvasPosition.y,
        });
      }
    } else {
      setTooltip(null); // Cierra el cuadro si no se selecciona un nodo
    }
  };

  const handleSelectEdge = (params: {
    nodes: string[];
    edges: string[];
    pointer: {
      DOM: { x: number; y: number };
      canvas: { x: number; y: number };
    };
  }) => {
    if (params.edges.length === 1 && params.nodes.length === 0) {
      const edge = params.edges[0];
      const all_edges = edges_.current.get();
      const selectedEdge = all_edges.find((e) => e.id === edge);
      if (selectedEdge) {
        if (
          selectedEdge.from?.toString().includes("host") ||
          selectedEdge.to?.toString().includes("host")
        )
          return;

        const from_ip = String(selectedEdge.label?.split("\n")[1]);
        const subred = from_ip.substring(0, from_ip.lastIndexOf(".") + 1);
        const gateway = from_ip.substring(from_ip.lastIndexOf(".") + 1);
        setTooltip({
          children: (
            <>
              <span>
                Desde: {selectedEdge.from} ({selectedEdge.label?.split("\n")[1]}
                )
              </span>
              <br />
              <span>
                Hacia: {selectedEdge.to} ({selectedEdge.label?.split("\n")[0]})
              </span>
              <br />
              <span>Subred: {`${subred}${Number(gateway) - 1}/30`}</span>
            </>
          ),
          x: params.pointer.DOM.x,
          y: params.pointer.DOM.y,
        });
      }
    }
  };

  useEffect(() => {
    subnets.connections.forEach((ipConnection) => {
      const neighbors = edges_.current
        .get()
        .filter((edge) => edge.from === ipConnection.id);
      neighbors.forEach((neighbor) => {
        const router_connections = ipConnection.connections?.filter(
          (c) => c.id === neighbor.to
        )[0];
        if (!router_connections) return;
        const label = `       ${router_connections.ip} \n${router_connections.gateway}`;
        neighbor.label = label;
      });
    });
  }, []);

  return (
    <div className="min-h-screen max-h-screen w-full grid grid-cols-7">
      <div className="col-span-2 max-h-lvh flex flex-col justify-center items-center">
        {/* <div className="h-full w-[35%] px-2 py-6 bg-gray-800 text-white flex flex-col overflow-auto">
        {subnets.script.split("\n").map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div> */}
        <div className="h-full w-full px-2 py-6 bg-gray-800 text-white flex flex-col overflow-auto">
          <div className="h-[90%]">
            <pre>{subnets.script}</pre>
          </div>
        </div>
      </div>
      <div className="col-span-5 relative">
        <NodeNetwork
          devices={devices}
          nodes={nodes_.current}
          edges={edges_.current}
          onSelectNode={handleSelectNode}
          onSelectEdge={handleSelectEdge}
          onClick={handleClick}
        />

        {tooltip && <Tooltip tooltip={tooltip} />}
      </div>
    </div>
  );
}
