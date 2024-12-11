"use client";
import { NoiceType } from "@/types/noice";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface NoiceProps {
  noice: NoiceType;
}

export function Noice({ noice }: NoiceProps) {
  if (noice.type === "loading") {
    return (
      <div
        className={cn(
          "fixed z-[100] inset-0 flex items-center justify-center bg-white",
          noice.styleType === "modal" && "bg-black bg-opacity-50"
        )}
      >
        <div
          role="status"
          className={cn(
            "flex flex-col justify-center items-center gap-4",
            noice.styleType === "modal" && "z-50 bg-white p-5 rounded-lg"
          )}
        >
          <svg
            aria-hidden="true"
            className="inline w-20 h-20 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
          <span className="ml-2 text-gray-800 dark:text-gray-200">
            {noice.message}
          </span>
        </div>
      </div>
    );
  }

  if (noice.type === "error") {
    return (
      <div
        className={cn(
          "fixed  z-50 right-0 top-0 w-lvw h-lvh flex items-center justify-center bg-white",
          noice.styleType === "modal" && "bg-black bg-opacity-50"
        )}
      >
        <div className="flex flex-col items-center rounded-lg gap-y-4 py-4 px-10 bg-white shadow-[0px_2px_10px_0px_rgba(0,0,0,0.08)] overflow-y-auto min-w-min">
          <div className="flex items-center justify-center min-w-16 min-h-16 rounded-[1.25rem] bg-[#ff4757]">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8"
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="white"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <p className="flex flex-col items-center text-sm font-medium text-[#BC1C21] gap-y-4">
            {noice.message || "Algo ha salido mal, vuelve a intentarlo luego."}
          </p>
          <div className="w-2/3 flex flex-col items-center gap-y-2">
            <Button
              onClick={() => {
                window.location.reload();
              }}
              variant={"outline"}
              className="text-black px-4 py-2 rounded-lg w-full min-w-min"
            >
              Volver a intentar
            </Button>
            <a className="w-full" href="/">
              <Button className="text-white bg-red-700 px-4 py-2 rounded-lg w-full">
                Ir al inicio
              </Button>
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (noice.type === "success") {
    return (
      <div
        className={cn(
          "fixed  z-50 right-0 top-0 w-lvw h-lvh flex items-center justify-center bg-white",
          noice.styleType === "modal" && "bg-black bg-opacity-50"
        )}
      >
        <div className="flex flex-col items-center rounded-lg  gap-y-4 px-[18px] py-4 bg-white shadow-[0px_2px_10px_0px_rgba(0,0,0,0.08)] ">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#22c55e]">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8"
            >
              <path
                d="M20 6L9 17L4 12"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <p className="flex flex-col items-center text-sm font-bold text-[#22c55e]">
            {noice.message || "Todo salio bien."}
          </p>
        </div>
      </div>
    );
  }
}
