import { Level } from "@/types/Level";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import { Button } from "./ui/button";

export function IAChat({
  update,
}: {
  update: (levels: Level[], ipbase: string, mask: number) => void;
}) {
  const [input, setInput] = useState<string>("");

  const onSubmit = async () => {
    if (!input || input.length === 0) return;
    const res = await fetch("http://127.0.0.1:8000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: input }),
    });
    const jsonData = await res.json();
    console.log(jsonData);
    const correctedData = jsonData
      .replace(/'/g, '"') // Cambiar comillas simples por dobles
      .replace(/(\b\w+\b)(?=\s*:)/g, '"$1"'); // Agregar comillas a las claves

    // Convertir a JSON
    const data = JSON.parse(correctedData);
    const data_levels =
      data.red[0].quantity === 1
        ? data.red
        : [{ name: "Central", quantity: 1 }, ...data.red];
    update(data_levels, data.ipbase, data.mask);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-800 md:text-5xl lg:text-6xl dark:text-white">
        Bienvenido a{" "}
        <span className="text-blue-600 dark:text-blue-500">NetSplitter</span>{" "}
      </h1>
      <p className="text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400">
        ¿Como puedo ayudarte?
      </p>
      <div className="w-full max-h-60 flex items-center justify-center">
        <Textarea
          className="mt-8 w-[80%] lg:w-[50%] max-h-60 p-4 text-base text-gray-800 bg-white border border-gray-300 rounded-lg shadow-sm dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:focus:ring-gray-600 dark:focus:ring-2 focus:ring-2 focus:ring-blue-600"
          placeholder="Quisiera una red que cuente con 5 edificios, 3 pisos por edificio y 10 hosts por piso....."
          onChange={(e) => setInput(e.target.value)}
        />
      </div>
      <Button type="button" className="w-1/4 my-4" onClick={onSubmit}>
        Generar
      </Button>
    </div>
  );
}
