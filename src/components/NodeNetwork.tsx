import { Network, Node, Edge, Options } from "vis-network";
import { DataSet } from "vis-data";
import { useEffect, useRef, useState } from "react";
import { Device } from "../types/Device";

const ROUTER_IMG = "https://www.svgrepo.com/show/474393/router.svg";
const HOST_IMG = "https://cdn-icons-png.flaticon.com/512/3067/3067287.png";

const image_options_host = {
  shape: "image",
  image: {
    selected: HOST_IMG,
    unselected: HOST_IMG,
  },
};

const image_options_router = {
  shape: "image",
  image: {
    selected: ROUTER_IMG,
    unselected: ROUTER_IMG,
  },
};

const image_options_central = {
  shape: "image",
  image: {
    selected:
      "https://static-00.iconduck.com/assets.00/router-icon-1024x884-baqzogkv.png",
    unselected:
      "https://static-00.iconduck.com/assets.00/router-icon-1024x884-baqzogkv.png",
  },
};

const DEVICE_WIDTH = 70;
const DEVICE_HEIGHT = 40;

const populateMesuarements = (device: Device): Device => {
  if (!device.devices || device.devices.length === 0) {
    return { ...device, width: DEVICE_WIDTH, height: DEVICE_HEIGHT };
  }

  const devices = device.devices.map((device) => {
    if (!device.devices || device.devices.length === 0) {
      return {
        ...device,
        width: DEVICE_WIDTH,
        height: DEVICE_HEIGHT,
      };
    }

    const devices = device.devices.map(populateMesuarements);
    const width =
      devices.reduce((acc, device) => Math.max(acc, device.width!), 0) +
      2 * DEVICE_WIDTH;
    const height =
      devices.reduce((acc, device) => acc + device.height!, 0) + DEVICE_HEIGHT;

    return { ...device, devices, width, height };
  });
  const width =
    devices.reduce((acc, device) => acc + device.width!, 0) + DEVICE_WIDTH;
  const height =
    devices.reduce((acc, device) => Math.max(acc, device.height!), 0) +
    2 * DEVICE_HEIGHT;

  return { ...device, devices, width, height };
};

export function NodeNetwork({
  devices,
  edges,
  nodes,
  onSelectNode,
  onSelectEdge,
  onClick,
}: {
  devices: Device[];
  edges: DataSet<Edge>;
  nodes: DataSet<Node>;
  onSelectNode?: (
    params: {
      nodes: string[];
      edges: string[];
      pointer: {
        DOM: { x: number; y: number };
        canvas: { x: number; y: number };
      };
    },
    network: Network
  ) => void;
  onSelectEdge?: (params: {
    nodes: string[];
    edges: string[];
    pointer: {
      DOM: { x: number; y: number };
      canvas: { x: number; y: number };
    };
  }) => void;
  onClick?: (params: {
    nodes: string[];
    edges: string[];
    pointer: {
      DOM: { x: number; y: number };
      canvas: { x: number; y: number };
    };
  }) => void;
}) {
  const networkContainer = useRef<HTMLDivElement>(null);
  const [network, setNetwork] = useState<Network | null>(null);

  useEffect(() => {
    if (networkContainer.current) {
      const options: Options = {
        layout: {
          hierarchical: {
            enabled: false,
          },
        },
        edges: {
          smooth: true, // Suavizar líneas
          color: {
            color: "#1e293b", // slate-800: Color base del borde
            highlight: "#0f172a", // slate-900: Color al seleccionar el borde
            hover: "#334155", // slate-700: Color al pasar el mouse sobre el borde
            inherit: "from", // Hereda el color del nodo de origen
            opacity: 0.9, // Un poco de transparencia para un efecto más suave
          },
        },
        physics: {
          enabled: false, // Activa física para distribuir los nodos
        },
      };

      const networkInstance = new Network(
        networkContainer.current,
        { nodes: nodes, edges: edges },
        options
      );
      setNetwork(networkInstance);
    }
  }, []);

  useEffect(() => {
    if (!network) return;

    const handleSelectNode = (params: {
      nodes: string[];
      edges: string[];
      pointer: {
        DOM: { x: number; y: number };
        canvas: { x: number; y: number };
      };
    }) => {
      if (onSelectNode) {
        onSelectNode(params, network);
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
      if (onSelectEdge) {
        onSelectEdge(params);
      }
    };

    const handleClick = (params: {
      nodes: string[];
      edges: string[];
      pointer: {
        DOM: { x: number; y: number };
        canvas: { x: number; y: number };
      };
    }) => {
      if (onClick) {
        onClick(params);
      }
    };

    network.on("selectNode", handleSelectNode);
    network.on("selectEdge", handleSelectEdge);
    network.on("click", handleClick);
  }, [network, onSelectNode]);

  useEffect(() => {
    if (!network) return;

    const data_nodes: Node[] = [];
    const data_edges: Edge[] = [];

    const centrals: { device: Device; x: number; y: number }[] = [];

    for (let i = 0; i < devices.length; i++) {
      if (devices[i].gateway === undefined) {
        const central = populateMesuarements(devices[i]);
        console.log(central);

        const x =
          i > 0
            ? centrals.reduce((acc, c) => acc + c.device.width!, 0) + 80
            : 80;
        const y = central.height!;

        console.log({ x, y });
        data_nodes.push({
          id: central.id,
          label: central.name,
          x,
          y,
          ...image_options_central,
        });

        centrals.push({ device: central, x, y });
      }
    }
    //const central = populateMesuarements(devices[0]);

    const addNodes = (
      devices: Device[],
      parent: Device,
      next_x: number,
      next_y: number
    ) => {
      devices.forEach((d_h) => {
        const x = next_x;
        const y = next_y;

        const image_options = d_h.name.includes("Host")
          ? image_options_host
          : image_options_router;

        data_nodes.push({
          id: d_h.id,
          label: d_h.name,
          x,
          y,
          ...image_options,
        });

        if (!edges.get().find((e) => e.from === parent.id && e.to === d_h.id)) {
          if (parent.id.split("-").length === 2) {
            data_edges.push({
              from: parent.id,
              to: d_h.id,
              label: "10 metros",
            });
          } else {
            data_edges.push({
              from: parent.id,
              to: d_h.id,
            });
          }
        }

        //console.log(d_h.name, x, y);
        //console.log({ next_x, next_y });

        if (d_h.devices) {
          let next_yv = next_y - DEVICE_HEIGHT;
          const next_xv = next_x + 80;
          d_h.devices.forEach((d_v) => {
            const x = next_xv;
            const y = next_yv;

            //console.log(d_v.name, d_v.height, x, y);
            const image_options = d_v.name.includes("Host")
              ? image_options_host
              : image_options_router;
            data_nodes.push({
              id: d_v.id,
              label: d_v.name,
              x,
              y,
              ...image_options,
            });

            if (
              !edges.get().find((e) => e.from === d_h.id && e.to === d_v.id)
            ) {
              data_edges.push({
                from: d_h.id,
                to: d_v.id,
              });
            }

            next_yv -= DEVICE_HEIGHT;

            //console.log({ next_xv, next_yv });
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

            //console.log(" --- Luego de renderizar hijos");
            //console.log({ next_xv, next_yv });
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

    for (let i = 0; i < centrals.length; i++) {
      addNodes(
        centrals[i].device.devices!,
        centrals[i].device,
        centrals[i].x,
        centrals[i].device.height! - 200
      );
    }

    // Configuración de la red

    nodes.clear();
    nodes.add(data_nodes);
    edges.add(data_edges);

    network.fit();
  }, [network, devices]);

  return <div ref={networkContainer} className="w-full h-full"></div>;
}
