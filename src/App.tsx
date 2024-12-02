import { useEffect, useState } from "react";
import { ViewerView } from "./components/ViewerView";
import { EditorView } from "./components/EditorView";

const App: React.FC = () => {
  const [mode, setMode] = useState<"view" | "edit">("edit");

  useEffect(() => {
    setMode("view");
  }, []);

  return (
    <div className="relative w-lvw h-lvh">
      {mode === "view" ? <ViewerView /> : <EditorView />}
    </div>
  );
};

export default App;
