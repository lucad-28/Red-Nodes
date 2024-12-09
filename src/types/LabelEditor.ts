export interface LabelEditInfo {
  x: number;
  y: number;
  label: string;
  units: string;
  onChange: (label: string) => void;
  onClose: () => void;
}
