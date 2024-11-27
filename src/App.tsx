import React, { useEffect, useRef, useState } from "react";
import { Network, Node, Edge, Options } from "vis-network";
import { DataSet } from "vis-data";
import "./App.css";
interface TooltipInfo {
  id: number;
  label: string;
  x: number;
  y: number;
}

interface Device {
  name: string;
  ip: string;
  width?: number;
  height?: number;
  gateway?: string;
  devices?: Device[];
}

const DEVICES: Device[] = [
  {
    name: "Central",
    ip: "192.168.0.1",
    devices: [
      {
        name: "Edificio 1",
        ip: "192.168.1.1",
        gateway: "192.168.0.1",
        devices: [
          { name: "Piso 1", ip: "192.168.1.2", gateway: "192.168.1.1" },
          { name: "Piso 2", ip: "192.168.1.3", gateway: "192.168.1.1" },
          { name: "Piso 3", ip: "192.168.1.4", gateway: "192.168.1.1" },
          { name: "Piso 4", ip: "192.168.1.5", gateway: "192.168.1.1" },
        ],
      },
      {
        name: "Edificio 2",
        ip: "192.168.2.1",
        gateway: "192.168.0.1",
        devices: [
          {
            name: "Piso 1",
            ip: "192.168.2.2",
            gateway: "192.168.2.1",
            devices: [
              {
                name: "Salon 1",
                ip: "192.168.3.1",
                gateway: "192.168.2.2",
              },
              {
                name: "Salon 2",
                ip: "192.168.3.2",
                gateway: "192.168.2.2",
              },
            ],
          },
          {
            name: "Piso 2",
            ip: "192.168.2.3",
            gateway: "192.168.2.1",
            devices: [
              {
                name: "Salon 1",
                ip: "192.168.4.1",
                gateway: "192.168.2.3",
                devices: [
                  {
                    name: "Equipo 1",
                    ip: "192.168.24.2",
                    gateway: "192.168.4.1",
                  },
                  {
                    name: "Equipo 2",
                    ip: "192.168.24.3",
                    gateway: "192.168.4.1",
                  },
                ],
              },
            ],
          },
          { name: "Piso 3", ip: "192.168.2.4", gateway: "192.168.2.1" },
          { name: "Piso 4", ip: "192.168.2.5", gateway: "192.168.2.1" },
          { name: "Piso 5", ip: "192.168.2.6", gateway: "192.168.2.1" },
        ],
      },
    ],
  },
];

const DEVICE_WIDTH = 70;
const DEVICE_HEIGHT = 40;

const populateMesuarements = (device: Device): Device => {
  if (!device.devices) {
    return { ...device, width: DEVICE_WIDTH, height: DEVICE_HEIGHT };
  }

  const devices = device.devices.map((device) => {
    if (!device.devices) {
      return {
        ...device,
        width: DEVICE_WIDTH,
        height: DEVICE_HEIGHT,
      };
    }

    const devices = device.devices.map(populateMesuarements);
    const width =
      devices.reduce((acc, device) => Math.max(acc, device.width!), 0) +
      DEVICE_WIDTH;
    const height =
      devices.reduce((acc, device) => acc + device.height!, 0) + DEVICE_HEIGHT;

    return { ...device, devices, width, height };
  });
  const width =
    devices.reduce((acc, device) => acc + device.width!, 0) + DEVICE_WIDTH;
  const height =
    devices.reduce((acc, device) => Math.max(acc, device.height!), 0) +
    DEVICE_HEIGHT;

  return { ...device, devices, width, height };
};

const App: React.FC = () => {
  const networkContainer = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<TooltipInfo | null>(null);

  useEffect(() => {
    if (!networkContainer.current) return;

    const data_nodes: Node[] = [];
    const data_edges: Edge[] = [];

    const central = populateMesuarements(DEVICES[0]);

    console.log(central);

    data_nodes.push({
      id: central.ip,
      label: central.name,
      x: 0,
      y: central.height!,
    });

    const addNodes = (
      devices: Device[],
      parent: Device,
      next_x: number,
      next_y: number
    ) => {
      devices.forEach((d_h) => {
        const x = next_x;
        const y = next_y;

        data_nodes.push({
          id: d_h.ip,
          label: d_h.name,
          x,
          y,
        });

        data_edges.push({
          from: parent.ip,
          to: d_h.ip,
        });

        console.log(d_h.name, x, y);
        console.log({ next_x, next_y });

        if (d_h.devices) {
          let next_yv = next_y - DEVICE_HEIGHT;
          const next_xv = next_x + 80;
          d_h.devices.forEach((d_v) => {
            const x = next_xv;
            const y = next_yv;

            console.log(d_v.name, d_v.height, x, y);
            data_nodes.push({
              id: d_v.ip,
              label: d_v.name,
              x,
              y,
            });

            data_edges.push({
              from: d_h.ip,
              to: d_v.ip,
            });

            next_yv -= DEVICE_HEIGHT;

            console.log({ next_xv, next_yv });
            if (d_v.devices) {
              addNodes(
                d_v.devices,
                d_v,
                next_xv + DEVICE_WIDTH,
                next_yv - DEVICE_HEIGHT
              );
              next_yv -=
                d_v
                  .devices!.map((d) => d.height!)
                  .reduce((acc, h) => Math.max(acc, h), 0) + 40;
            }

            console.log(" --- Luego de renderizar hijos");
            console.log({ next_xv, next_yv });
            next_x = x;
          });
          const max_w_childrens = d_h.devices!.reduce(
            (acc, d) => (d.width! > acc ? d.width! : acc),
            0
          );

          next_x += max_w_childrens;
        }

        next_x += DEVICE_WIDTH;
      });
    };

    addNodes(central.devices!, central, 0 + 80, central.height! - 40);

    // Configuración de la red
    const options: Options = {
      layout: {
        hierarchical: {
          enabled: false,
        },
      },
      edges: {
        smooth: true, // Suavizar líneas
      },
      physics: {
        enabled: false, // Activa física para distribuir los nodos
      },
    };

    const nodes = new DataSet<Node>([...data_nodes]);
    const edges = new DataSet<Edge>(data_edges);

    console.log(nodes);
    // Inicializar la red
    const network = new Network(
      networkContainer.current,
      { nodes, edges },
      options
    );

    // Evento para capturar clics en los nodos
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleClick = (params: any) => {
      if (params.nodes.length > 0) {
        console.log(params.nodes);
        const nodeId = params.nodes[0]; // ID del nodo clickeado
        const all_nodes = nodes.get(); // Información del nodo

        const node = all_nodes.find((n) => n.id === nodeId); // Buscar el nodo en la lista

        if (node) {
          const position = network.getPositions(nodeId); // Posición del nodo en el canvas
          const canvasPosition = network.canvasToDOM(position[nodeId]); // Convertir a coordenadas del DOM

          setTooltip({
            id: node.id as number,
            label: node.label as string,
            x: canvasPosition.x,
            y: canvasPosition.y,
          });
        }
      } else {
        setTooltip(null); // Cierra el cuadro si no se selecciona un nodo
      }
    };

    network.on("click", handleClick);

    return () => {
      // Limpia la red y los listeners al desmontar el componente
      network.off("click", handleClick);
      network.destroy();
    };
  }, []);

  return (
    <div style={{ position: "relative" }}>
      {/* Contenedor de la red */}
      <div
        ref={networkContainer}
        style={{ width: "800px", height: "600px", border: "1px solid black" }}
      ></div>

      {/* Tooltip para mostrar información del nodo */}
      {tooltip && (
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
          <p>
            <strong>ID:</strong> {tooltip.id}
          </p>
          <p>
            <strong>Label:</strong> {tooltip.label}
          </p>
        </div>
      )}
    </div>
  );
};

export default App;
