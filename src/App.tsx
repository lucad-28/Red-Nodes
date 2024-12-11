import { useEffect, useRef, useState } from "react";
import { ViewerView } from "./components/ViewerView";
import { EditorView } from "./components/EditorView";
import { DataSet } from "vis-data";
import { Edge, Node } from "vis-network";
import { Device } from "./types/Device";
import { IAChat } from "./components/IAChat";
import { Level } from "./types/Level";
import { formatDevicesToBackend } from "./lib/utils";
import { BackendResponse } from "./types/BackendResponse";
import { NoiceType } from "./types/noice";
import { Noice } from "./components/Noice";

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
  const [noice, setNoice] = useState<NoiceType | null>({
    type: "loading",
    message: "Configurando algunas cosas",
  });

  const onSubmit = async () => {
    setNoice({
      type: "loading",
      message: "Estoy procesando tu solicitud",
      styleType: "modal",
    });
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

    try {
      const res = await fetch("https://pf-rtxac.onrender.com/generar-red", {
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

      if (!res.ok) {
        throw new Error("Error al contactar con el servidor");
      }

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      console.log(data);
      setSubnets(data);
      setMode("view");
      setNoice(null);
    } catch (e) {
      console.error(e);
      if (e instanceof Error) {
        setNoice({
          type: "error",
          message: e.message,
          styleType: "modal",
        });
        return;
      }

      setNoice({
        type: "error",
        message: "Error al contactar con el servidor",
        styleType: "modal",
      });
    }
  };

  useEffect(() => {
    const comunicate_api = async () => {
      try {
        const res = await fetch("https://pf-rtxac.onrender.com/");
        if (!res.ok) {
          throw new Error("Error al contactar con el servidor");
        }

        setNoice(null);
      } catch {
        setNoice({
          type: "error",
          message: "Error al contactar con el servidor",
          styleType: "modal",
        });
      }
    };

    comunicate_api();
  }, []);

  return (
    <div className="relative w-lvw h-lvh">
      {noice && <Noice noice={noice} />}
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
