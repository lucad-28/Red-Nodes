import { useRef, useState } from "react";
import { ViewerView } from "./components/ViewerView";
import { EditorView } from "./components/EditorView";
import { DataSet } from "vis-data";
import { Edge, Node } from "vis-network";
import { Device } from "./types/Device";
import { IAChat } from "./components/IAChat";
import { Level } from "./types/Level";
import { formatDevicesToBackend } from "./lib/utils";
import { BackendResponse } from "./types/BackendResponse";

/*
[
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
  ]
    */

const App: React.FC = () => {
  const [mode, setMode] = useState<"ia" | "view" | "edit">("ia");
  const nodes_ = useRef<DataSet<Node>>(new DataSet());
  const edges_ = useRef<DataSet<Edge>>(new DataSet());
  const [devices, setDevices] = useState<Device[]>([
    {
      name: "Central",
      id: "central",
    },
  ]);
  const [levels, setLevels] = useState<Level[] | null>();
  const [ipbase, setIpbase] = useState<string>("");
  const [mask, setMask] = useState<number>();
  const [subnets, setSubnets] = useState<BackendResponse>();

  const onSubmit = async () => {
    console.log("Dispositivos");

    const formatted_devices = formatDevicesToBackend(devices);
    const formatted_connections = edges_.current
      .get()
      .filter((e) => !e.to?.toString().includes("host"))
      .map((e) => {
        if (e.label?.split(" ")[1] === "metros") {
          return {
            from: e.from,
            to: e.to,
            distance: e.label?.split(" ")[0],
          };
        }

        return {
          from: e.from,
          to: e.to,
        };
      });

    console.log(formatted_devices);
    console.log("Connections");
    console.log(formatted_connections);

    const res = await fetch("http://127.0.0.1:8000/generar-red", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        red: formatted_devices[0],
        base_ip: ipbase,
        mask,
        table: formatted_connections,
      }),
    });

    const data = await res.json();
    console.log(data);
    setSubnets(data);
    setMode("view");
  };

  return (
    <div className="relative w-lvw h-lvh">
      {mode === "ia" ? (
        <IAChat
          update={(levels: Level[], ipbase: string, mask: number) => {
            setLevels(levels);
            setIpbase(ipbase);
            setMask(mask);
            setMode("edit");
          }}
        />
      ) : mode === "view" ? (
        subnets && (
          <ViewerView
            subnets={subnets}
            edges_={edges_}
            nodes_={nodes_}
            devices={devices}
          />
        )
      ) : (
        levels && (
          <EditorView
            devices={devices}
            levels={levels}
            nodes_={nodes_}
            edges_={edges_}
            updateLevels={(levels) => setLevels(levels)}
            updateDevices={(devices) => setDevices(devices)}
            onSubmit={onSubmit}
          />
        )
      )}
    </div>
  );
};

export default App;
