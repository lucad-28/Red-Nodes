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
