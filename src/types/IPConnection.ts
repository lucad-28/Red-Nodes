export interface IPConnection {
  id: string;
  ip?: string;
  subnet?: string;
  gateway?: string;
  connections?: IPConnection[];
}


export const MOCKUP_IPCONNECTIONS: IPConnection[] = [
    {
      id: "Central-1",
      connections: [
        {
          id: "Central-1-Edificio-1",
          ip: "192.162.96.2",
          subnet: "192.162.96.0/30",
          gateway: "192.162.96.1",
        },
        {
          id: "Central-1-Edificio-2",
          ip: "192.162.96.6",
          subnet: "192.162.96.4/30",
          gateway: "192.162.96.5",
        },
      ],
    },
    {
      id: "Central-1-Edificio-1",
      connections: [
        {
          id: "Central-1-Edificio-1-Piso-1",
          ip: "192.162.28.2",
          subnet: "192.162.28.0/30",
          gateway: "192.162.28.1",
        },
        {
          id: "Central-1-Edificio-1-Piso-2",
          ip: "192.162.28.6",
          subnet: "192.162.28.4/30",
          gateway: "192.162.28.5",
        },
        {
          id: "Central-1-Edificio-1-Piso-3",
          ip: "192.162.28.10",
          subnet: "192.162.28.8/30",
          gateway: "192.162.28.9",
        },
        {
          id: "Central-1-Edificio-1-Piso-4",
          ip: "192.162.28.14",
          subnet: "192.162.28.12/30",
          gateway: "192.162.28.13",
        },
        {
          id: "Central-1-Edificio-1-Piso-5",
          ip: "192.162.28.18",
          subnet: "192.162.28.16/30",
          gateway: "192.162.28.17",
        },
        {
          id: "Central-1-Edificio-1-Piso-6",
          ip: "192.162.28.22",
          subnet: "192.162.28.20/30",
          gateway: "192.162.28.21",
        },
      ],
    },
    {
      id: "Central-1-Edificio-1-Piso-1",
      connections: [
        {
          id: "Central-1-Edificio-1-Piso-1-Cuarto-1",
          ip: "192.162.3.130",
          subnet: "192.162.3.128/30",
          gateway: "192.162.3.129",
        },
        {
          id: "Central-1-Edificio-1-Piso-1-Cuarto-2",
          ip: "192.162.3.134",
          subnet: "192.162.3.132/30",
          gateway: "192.162.3.133",
        },
        {
          id: "Central-1-Edificio-1-Piso-1-Cuarto-3",
          ip: "192.162.3.138",
          subnet: "192.162.3.136/30",
          gateway: "192.162.3.137",
        },
      ],
    },
    {
      id: "Central-1-Edificio-2",
      connections: [
        {
          id: "Central-1-Edificio-2-Piso-1",
          ip: "192.162.60.2",
          subnet: "192.162.60.0/30",
          gateway: "192.162.60.1",
        },
        {
          id: "Central-1-Edificio-2-Piso-2",
          ip: "192.162.60.6",
          subnet: "192.162.60.4/30",
          gateway: "192.162.60.5",
        },
        {
          id: "Central-1-Edificio-2-Piso-3",
          ip: "192.162.60.10",
          subnet: "192.162.60.8/30",
          gateway: "192.162.60.9",
        },
        {
          id: "Central-1-Edificio-2-Piso-4",
          ip: "192.162.60.14",
          subnet: "192.162.60.12/30",
          gateway: "192.162.60.13",
        },
        {
          id: "Central-1-Edificio-2-Piso-5",
          ip: "192.162.60.18",
          subnet: "192.162.60.16/30",
          gateway: "192.162.60.17",
        },
        {
          id: "Central-1-Edificio-2-Piso-6",
          ip: "192.162.60.22",
          subnet: "192.162.60.20/30",
          gateway: "192.162.60.21",
        },
        {
          id: "Central-1-Edificio-2-Piso-7",
          ip: "192.162.60.26",
          subnet: "192.162.60.24/30",
          gateway: "192.162.60.25",
        },
      ],
    },
  ];