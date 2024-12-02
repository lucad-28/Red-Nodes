import { useEffect, useRef, useState } from "react";
import { Device } from "../types/Device";
import { NodeNetwork } from "./NodeNetwork";
import { Level } from "../types/Level";
import { Edge, Node } from "vis-network";
import { DataSet } from "vis-data";
import { verifyLabelToUpdate, verifyNodeToConnect } from "../lib/utils";
import { EditorLevel } from "./EditorLevel";
import { LabelEditInfo } from "@/types/LabelEditor";
import { LabelEditor } from "./LabelEditor";
import { Button } from "./ui/button";
import { EditorMenuInfo } from "@/types/EditorMenuInfo";
import { EditorMenu } from "./EditorMenu";

export function EditorView() {
  const [devices, setDevices] = useState<Device[]>([
    {
      name: "Central",
      id: "central",
    },
  ]);
  const customConnectionRef = useRef<Edge | null>(null);
  const nodes_ = useRef<DataSet<Node>>(new DataSet());
  const edges_ = useRef<DataSet<Edge>>(new DataSet());
  const [menuEdit, setMenuEdit] = useState<EditorMenuInfo | null>(null);
  const [labelEdit, setLabelEdit] = useState<LabelEditInfo | null>(null);
  const [levels, setLevels] = useState<Level[]>([
    {
      name: "Area",
      quantity: 2,
    },
    {
      name: "Edificio",
      quantity: 2,
    },
    {
      name: "Piso",
      quantity: 4,
    },
    {
      name: "Salon",
      quantity: 2,
      hosts: 12,
    },
  ]);

  useEffect(() => {
    console.log("Levels changed");
    const createDevice = (name: string, id: string): Device => ({
      name,
      id,
    });

    const build = (
      currentLevel: { name: string; quantity: number }[],
      depth = 0,
      parentName = ""
    ): Device[] => {
      if (depth >= currentLevel.length) {
        return [];
      }

      const current = currentLevel[depth];
      const devices: Device[] = [];

      for (let i = 0; i < current.quantity; i++) {
        const currentId =
          parentName === ""
            ? `${current.name}-${i + 1}`
            : `${parentName}-${current.name}-${i + 1}`;
        const device = createDevice(`${current.name}-${i + 1}`, currentId);
        device.devices = build(currentLevel, depth + 1, currentId); // Recurse to the next level.
        devices.push(device);
      }

      return devices;
    };

    setDevices(build(levels));
  }, [levels]);

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

    setMenuEdit(null);
  };

  const handleSelectNode = (params: {
    nodes: string[];
    edges: string[];
    pointer: {
      DOM: { x: number; y: number };
      canvas: { x: number; y: number };
    };
  }) => {
    if (params.nodes.length > 0) {
      if (params.nodes[0].split("-").length > 4) {
        setMenuEdit(null);
        return;
      }

      if (
        customConnectionRef.current?.from &&
        !customConnectionRef.current?.to
      ) {
        customConnectionRef.current.to = params.nodes[0];
        if (verifyNodeToConnect(customConnectionRef.current)) {
          const new_edge = customConnectionRef.current;
          if (new_edge.from === new_edge.to) return;
          if (
            edges_?.current
              .get()
              .find((e) => e.from === new_edge.from && e.to === new_edge.to)
          )
            return;
          console.log("ADD EDGE", new_edge);
          console.log(edges_?.current.get());
          edges_?.current.add({
            from: new_edge.from,
            to: new_edge.to,
            label: "100 Mbps",
          });
        }
      } else {
        setMenuEdit({
          mode: "device",
          x: params.pointer.DOM.x,
          y: params.pointer.DOM.y,
          handle: {
            addConnection: () => {
              if (params.nodes.length > 0) {
                customConnectionRef.current = {
                  from: params.nodes[0],
                };
                setMenuEdit(null);
              }
            },
          },
        });
      }
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
    if (params.edges.length === 1) {
      console.log(edges_.current.get(params.edges[0]));
      const edge = edges_.current.get(params.edges[0]);

      if (!edge) return;
      if (!verifyLabelToUpdate(edge)) return;

      setMenuEdit({
        mode: "connection",
        x: params.pointer.DOM.x,
        y: params.pointer.DOM.y,
        handle: {
          editConnection: () => {
            setLabelEdit({
              x: params.pointer.DOM.x,
              y: params.pointer.DOM.y,
              label: edge.label as string,
              onChange: (label: string) => {
                if (edges_.current) {
                  edges_.current.update({
                    id: edge.id,
                    from: edge.from,
                    to: edge.to,
                    label,
                  });
                }
                setLabelEdit(null);
              },
              onClose: () => {
                setLabelEdit(null);
              },
            });
            setMenuEdit(null);
          },
          deleteConnection: () => {
            if (edges_.current) {
              edges_.current.remove(edge.id);
            }
            setMenuEdit(null);
          },
        },
      });
    }
  };

  const onSubmit = () => {
    console.log("Dispositivos");
    console.log(devices);
    console.log("Connections");
    console.log(edges_.current.get());
  };

  return (
    <div className="min-h-screen max-h-screen w-full grid grid-cols-7">
      <div className="col-span-2 max-h-lvh flex flex-col justify-center items-center">
        <EditorLevel
          levels={levels}
          updateLevels={(levels) => {
            setLevels(levels);
          }}
        />
        <Button onClick={onSubmit} className="bg-emerald-800 hover:bg-emerald-900 w-10/12">Generar Red</Button>
      </div>
      <div className="col-span-5 relative">
        <div className="absolute -left-2 top-0 h-full w-2 opacity-50 bg-gradient-to-r from-transparent to-slate-800"></div>
        <div className="absolute left-0 top-0 h-full w-2 opacity-50 bg-gradient-to-r from-slate-800 to-transparent"></div>
        <NodeNetwork
          devices={devices}
          onSelectNode={handleSelectNode}
          onSelectEdge={handleSelectEdge}
          onClick={handleClick}
          nodes={nodes_.current}
          edges={edges_.current}
        />
        {labelEdit && <LabelEditor labelEdit={labelEdit} />}
        {menuEdit && <EditorMenu menuEdit={menuEdit} />}
      </div>
    </div>
  );
}
