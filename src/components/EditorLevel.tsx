import { Level } from "@/types/Level";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const levelSchema = z.object({
  name: z.string(),
  max_quantity: z.preprocess(
    (val) => (typeof val === "string" ? parseInt(val) : val),
    z
      .number()
      .refine((val) => !isNaN(val), { message: "Debe ser un número válido" })
  ),
  max_hosts: z.preprocess(
    (val) => (typeof val === "string" ? parseInt(val) : val),
    z
      .number()
      .refine((val) => !isNaN(val), { message: "Debe ser un número válido" })
      .optional()
  ),
});

const levelsFormSchema = z.object({
  levels: z.array(levelSchema),
});

type LevelForm = z.infer<typeof levelsFormSchema>;

export function EditorLevel({
  levels,
  updateLevels,
}: {
  levels: Level[];
  updateLevels: (levels: Level[]) => void;
}) {
  const form = useForm<LevelForm>({
    resolver: zodResolver(levelsFormSchema),
    defaultValues: {
      levels: levels.map((level) => ({
        name: level.name,
        max_quantity: level.quantity,
        max_hosts: level.hosts,
      })),
    },
  });

  const levelsFields = useFieldArray({
    control: form.control,
    name: "levels",
  });

  const onSubmit = async (data: LevelForm) => {
    console.log(data);
    updateLevels(
      form.getValues().levels.map((level, index) => {
        if (index === levels.length - 1)
          return {
            name: level.name,
            quantity: level.max_quantity,
            hosts: level.max_hosts,
          };

        return {
          name: level.name,
          quantity: level.max_quantity,
        };
      })
    );
  };

  useEffect(() => {
    console.log(form.formState.errors);
  }, [form.formState.errors]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="h-[90%] w-full py-3 px-4 grid grid-rows-5 justify-items-center"
      >
        <div className="row-span-4 max-h-full justify-items-center">
          <h1 className="text-2xl text-slate-800 font-light ">Editor</h1>
          <div className="overflow-auto h-[90%] justify-items-center">
            {levelsFields.fields.map((field, index) => (
              <div
                key={field.id}
                className="flex flex-col items-center space-x-4 w-4/5 pt-3 relative"
              >
                <h2 className="text-lg font-bold">Nivel {index + 1}</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
                  <div className="flex flex-col justify-between">
                    <label className="text-sm">Nombre</label>
                    <Input
                      {...form.register(`levels.${index}.name`)}
                      defaultValue={field.name}
                      placeholder="Nombre"
                      className="border border-gray-300 text-center p-2 rounded"
                    />
                  </div>
                  <div className="w-full flex flex-col justify-between">
                    <label className="text-sm">Cantidad Máxima</label>
                    <Input
                      {...form.register(`levels.${index}.max_quantity`)}
                      defaultValue={field.max_quantity}
                      type="number"
                      placeholder="Cantidad máxima"
                      className="border border-gray-300 text-center p-2 rounded"
                    />
                  </div>
                </div>
                {index === levelsFields.fields.length - 1 && (
                  <>
                    <label className="text-sm pt-2">
                      Cantidad Máxima de Hosts
                    </label>
                    <Input
                      {...form.register(`levels.${index}.max_hosts`)}
                      defaultValue={field.max_hosts || 1}
                      placeholder="Cantidad máxima de hosts"
                      className="w-4/5 border border-gray-300 text-center p-2 rounded"
                    />
                    <Button
                      type="button"
                      onClick={() =>
                        levelsFields.remove(levelsFields.fields.length - 1)
                      }
                      variant={"destructive"}
                      className="absolute top-3 -right-5"
                    >
                      &times;
                    </Button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="row-span-1 flex flex-col w-11/12 space-y-2">
          <Button
            type="button"
            onClick={() =>
              levelsFields.append({
                name: "",
                max_quantity: 1,
                max_hosts: 20,
              })
            }
            variant={"outline"}
          >
            Agregar Nivel
          </Button>
          <Button type="submit">Actualizar Previsualización</Button>
        </div>
      </form>
    </Form>
  );
}
