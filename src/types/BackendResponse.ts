import { IPConnection } from "./IPConnection";

export interface Router {
  name: string;
  segment: {
    network: string;
    subnets: string[];
  };
  children: Router[];
}

export interface BackendResponse {
  connections: IPConnection[];
  router: Router;
  script: string;
}
