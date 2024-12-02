export interface Device {
  name: string;
  id: string;
  width?: number;
  height?: number;
  gateway?: string;
  devices?: Device[];
}

// MOCKUPS VIEWERVIEW
export const DEVICES_VIEWER_MOCKUP: Device[] = [
  {
    name: "Central",
    id: "192.168.0.1",
    devices: [
      {
        name: "Edificio 1",
        id: "192.168.1.1",
        gateway: "192.168.0.1",
        devices: [
          { name: "Piso 1", id: "192.168.1.2", gateway: "192.168.1.1" },
          { name: "Piso 2", id: "192.168.1.3", gateway: "192.168.1.1" },
          { name: "Piso 3", id: "192.168.1.4", gateway: "192.168.1.1" },
          { name: "Piso 4", id: "192.168.1.5", gateway: "192.168.1.1" },
        ],
      },
      {
        name: "Edificio 2",
        id: "192.168.2.1",
        gateway: "192.168.0.1",
        devices: [
          {
            name: "Piso 1",
            id: "192.168.2.2",
            gateway: "192.168.2.1",
            devices: [
              {
                name: "Salon 1",
                id: "192.168.3.1",
                gateway: "192.168.2.2",
              },
              {
                name: "Salon 2",
                id: "192.168.3.2",
                gateway: "192.168.2.2",
              },
            ],
          },
          {
            name: "Piso 2",
            id: "192.168.2.3",
            gateway: "192.168.2.1",
            devices: [
              {
                name: "Salon 1",
                id: "192.168.4.1",
                gateway: "192.168.2.3",
                devices: [
                  {
                    name: "Equido 1",
                    id: "192.168.24.2",
                    gateway: "192.168.4.1",
                  },
                  {
                    name: "Equido 2",
                    id: "192.168.24.3",
                    gateway: "192.168.4.1",
                  },
                ],
              },
            ],
          },
          { name: "Piso 3", id: "192.168.2.4", gateway: "192.168.2.1" },
          { name: "Piso 4", id: "192.168.2.5", gateway: "192.168.2.1" },
          { name: "Piso 5", id: "192.168.2.6", gateway: "192.168.2.1" },
        ],
      },
    ],
  },
];
