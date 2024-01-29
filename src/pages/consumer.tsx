import { useRouter } from "next/router";
import { Button } from "@/atoms/Button";
import { useEffect, useState } from "react";
import axios from "axios";

interface Widget {
  id: number;
  name: string;
  state: Record<string, string>;
}

const WidgetShow = ({ name, state }: Widget) => {

  switch (name) {
    case "button": {
      return (
        <Button className="w-fit" onClick={() => alert(state?.alertMessage)}>
          {state?.btnText}
        </Button>
      );
    }
    case "paragraph": {
      return <div>{state?.text}</div>;
    }
  }
};

export default function Consumer() {
  const router = useRouter();

  const [pageWidgets, setPageWidgets] = useState<Widget[]>([]);

  useEffect(() => {

    axios
      .get("/api/configs")
      .then(({ data }) => {
        setPageWidgets(data);
      })
      .catch();
  }, []);

  return <main className="p-4 flex flex-col items-center space-y-4" >
    {pageWidgets?.map?.((w, idx) => {
      return <WidgetShow id={w?.id ?? idx} key={w?.id ?? idx} name={w?.name ?? ''} state={w?.state ?? {}} />;
    })}
  </main>;
}
