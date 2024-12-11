import { Router } from "@/types/BackendResponse";
import { Device } from "@/types/Device";
import { Level } from "@/types/Level";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Edge } from "vis-network";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// If it returns TRUE, is possible to connect the node
export const verifyNodeToConnect = (customConnection: Edge) => {
  if (customConnection.from === customConnection.to) return false;

  const identifiers = customConnection.from?.toString().split("-") || [""];
  console.log("IDENTIFIERS 1");
  console.log(identifiers);
  const identifiers2 = customConnection.to?.toString().split("-") || [""];
  console.log("IDENTIFIERS 2");
  console.log(identifiers2);

  if (identifiers.length === 2 && identifiers2.length === 2) return true;

  if (identifiers[1] !== identifiers2[1]) return false;

  return true;
};

export const verifyLabelToUpdate = (edge: Edge) => {
  const identifiers = edge.from?.toString().split("-") || [""];
  const identifiers2 = edge.to?.toString().split("-") || [""];

  if (identifiers.length <= 4 && identifiers2.length <= 4) return true;
};

export const findAndRemoveDevice = (
  roots: Device[],
  id: string,
  host_last_level: number
): Device[] => {
  return roots.map((root) => {
    if (root.id === id) {
      console.log("FOUND");
      return {
        ...root,
        devices: [
          {
            name: `${host_last_level} Hosts`,
            id: `${root.id}-host`,
          },
        ],
      }; // Indicate the node was found and modified
    }

    // If the current node has devices, iterate through them
    if (root.devices) {
      const new_devices = findAndRemoveDevice(
        root.devices,
        id,
        host_last_level
      );
      return { ...root, devices: new_devices };
    }

    return root;
  });
};

export const findAndAddHost = (
  roots: Device[],
  id: string,
  hosts: number
): Device[] => {
  return roots.map((root) => {
    if (root.id === id) {
      console.log("FOUND");

      if (id.includes("host")) return { ...root, name: `${hosts} Hosts` };

      return {
        ...root,
        hosts,
        devices: root.devices
          ? [
              ...root.devices.filter((d) => d.id !== `${root.id}-host`),
              {
                name: `${hosts} Hosts`,
                id: `${root.id}-host`,
              },
            ]
          : [
              {
                name: `${hosts} Hosts`,
                id: `${root.id}-host`,
              },
            ],
      };
    }
    if (root.devices) {
      const new_devices = findAndAddHost(root.devices, id, hosts);
      return { ...root, devices: new_devices };
    }

    return root;
  });
};

interface DeviceBackend {
  name: string;
  id: string;
  connections?: DeviceBackend[];
  hosts?: number;
}

export const formatDevicesToBackend = (devices: Device[]): DeviceBackend[] => {
  return devices.map((device) => {
    if (device.devices) {
      const new_devices = formatDevicesToBackend(device.devices);

      const device_host = new_devices.find((d) => d.id.includes("host"));

      if (device_host) {
        const new_connections = new_devices.filter(
          (d) => d.id !== device_host.id
        );

        if (new_connections.length === 0)
          return {
            name: device.name,
            id: device.id,
            hosts: Number(device_host.name.split(" ")[0]),
          };

        return {
          name: device.name,
          id: device.id,
          connections: new_connections,
          hosts: Number(device_host.name.split(" ")[0]),
        };
      }

      return { name: device.name, id: device.id, connections: new_devices };
    }

    return { name: device.name, id: device.id, hosts: device.hosts };
  });
};

export const findAndAddDevice = (
  devices: Device[],
  id: string,
  levels: Level[]
): Device[] => {
  return devices.map((root) => {
    if (root.id === id) {
      console.log("FOUND");

      const segments = root.name.split("-");
      const root_level = levels.find(
        (l) => l.name === segments[segments.length - 2]
      );

      if (!root_level) return root;

      const current_level = levels[levels.indexOf(root_level) + 1];

      const devices_no_host = root.devices?.filter(
        (d) => !d.id.includes("host")
      );

      const last_device = devices_no_host ? devices_no_host.pop() : null;

      const name = `${current_level?.name}-${
        last_device ? Number(last_device.name.split("-")[1]) + 1 : 1
      }`;

      const new_device = {
        name: name,
        id: `${id}-${name}`,
        devices: [
          {
            name: `${levels[levels.length - 1].hosts} Hosts`,
            id: `${id}-${name}-host`,
          },
        ],
      };

      return {
        ...root,
        devices: root.devices
          ? last_device
            ? [...root.devices, new_device]
            : [
                ...root.devices.filter((d) => !d.id.includes("host")),
                new_device,
              ]
          : [new_device],
      };
    }

    if (root.devices) {
      const new_devices = findAndAddDevice(root.devices, id, levels);
      return { ...root, devices: new_devices };
    }

    return root;
  });
};

export function findNetworkByName(root: Router, targetName: string): string | null {
  // Verificar si el router actual es el buscado
  if (root.name === targetName) {
    return root.segment.network;
  }

  // Buscar en los hijos recursivamente
  for (const child of root.children) {
    const result = findNetworkByName(child, targetName);
    if (result !== null) {
      return result;
    }
  }

  // Si no se encuentra, retornar null
  return null;
}