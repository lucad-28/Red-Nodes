export interface LabelEditInfo {
  x: number;
  y: number;
  label: string;
  onChange: (label: string) => void;
  onClose: () => void;
}
