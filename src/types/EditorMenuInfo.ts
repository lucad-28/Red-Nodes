export interface EditorMenuInfo {
  mode: "device" | "connection";
  x: number;
  y: number;
  handle: {
    "addConnection"?: () => void;
    "deleteConnection"?: () => void;
    "editConnection"?: () => void;
  };
}
