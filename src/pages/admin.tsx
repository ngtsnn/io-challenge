import { useRouter } from "next/router";
import { Button } from "@/atoms/Button";
import { LinkBtn } from "@/atoms/LinkBtn";
import widgets from "@/configs/widgets";
import { WidgetIcon } from "@/components/WidgetIcon";
import { DragEventHandler, useRef, useState } from "react";

interface Widget {
  id: number;
  name: string;
  state: Record<string, string>;
}

interface WidgetShow {
  widget: Widget;
  onSelected: (w: Widget) => unknown;
}

interface WidgetConfig {
  widget: Widget;
  onUpdate: (w: Widget) => unknown;
  onDelete: () => unknown;
}

const WidgetShow = ({ widget, onSelected }: WidgetShow) => {
  const { name, state } = widget;
  switch (name) {
    case "button": {
      return (
        <Button onClick={() => onSelected(widget)}>{state?.btnText}</Button>
      );
    }
    case "paragraph": {
      return <div onClick={() => onSelected(widget)}>{state?.text}</div>;
    }
  }
};

const WidgetConfigShow = ({ widget, onDelete, onUpdate }: WidgetConfig) => {
  const [state, setState] = useState(widget.state);

  const onChange = (s: string, v: string) => {
    setState((old) => ({ ...old, [s]: v }));
  };

  return (
    <div className="flex flex-col space-y-2">
      {Object.keys(state).map((s) => {
        return (
          <div className="flex items-center space-x-2" key={s}>
            <span>{s}: </span>
            {widget.name === "paragraph" && s === "text" ? (
              <textarea
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={state[s]}
                onChange={(e) => onChange(s, e.target.value)}
              />
            ) : (
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={state[s]}
                onChange={(e) => onChange(s, e.target.value)}
              />
            )}
          </div>
        );
      })}

      <div className="flex space-x-2">
        <Button onClick={() => onUpdate({...widget, state})} >Update</Button>
        <Button varient="danger" onClick={onDelete}>Delete</Button>
      </div>
    </div>
  );
};

export default function Admin() {
  const router = useRouter();

  const editTableRef = useRef<HTMLDivElement>(null);
  const [draggedEle, setDraggedEle] = useState<string | null>(null);
  const [pageWidgets, setPageWidgets] = useState<Widget[]>([]);
  const [widgetEdition, setWidgetEdition] = useState<Widget | null>(null);

  const onSave = () => {};
  const undo = () => {};
  const redo = () => {};
  const onImport = () => {};
  const onExport = () => {};

  const onDrop: DragEventHandler<HTMLDivElement> = (e) => {
    if (!draggedEle) {
      return null;
    }

    const widget = widgets.find((w) => w.name === draggedEle);
    if (widget) {
      setPageWidgets((old) => [
        ...old,
        {
          id: Date.now(),
          name: widget.name,
          state: widget.defaultState,
        },
      ]);
    }

    setDraggedEle(null);
  };

  return (
    <main className="">
      <div className="h-6"></div>
      <div className="flex justify-center">
        <Button onClick={onSave}>Save</Button>
        <Button onClick={undo}>Undo</Button>
        <Button onClick={redo}>Redo</Button>
        <Button onClick={onImport}>Import</Button>
        <Button onClick={onExport}>Export</Button>
        <LinkBtn href="/consumer">View</LinkBtn>
      </div>

      <div className="flex border-t">
        <div className="hidden cursor-grab opacity-0"></div>
        <div className="hidden cursor-grabbing"></div>
        <div className="w-32 border-r flex flex-col p-4 space-y-4">
          {widgets.map((w) => {
            return (
              <WidgetIcon
                draggable
                onDrag={(e) => {
                  e.currentTarget.classList.add("opacity-0");
                  e.currentTarget.classList.add("cursor-grabbing");
                  setDraggedEle(w.name);
                }}
                onDragEnd={(e) => {
                  e.currentTarget.classList.remove("opacity-0");
                  e.currentTarget.classList.remove("cursor-grabbing");
                }}
                name={w.name}
                thumb={w.thumb}
                key={w.name}
              />
            );
          })}
        </div>
        <div className="flex-1">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onDrop={onDrop}
            className="flex flex-col border-b p-4 min-h-[50vh]"
            ref={editTableRef}
          >
            {pageWidgets.map((w) => {
              return (
                <WidgetShow
                  widget={w}
                  onSelected={(w) => {
                    console.log('w:', w)
                    setWidgetEdition(w);
                  }}
                  key={w.id}
                />
              );
            })}
          </div>
          <div className="p-4">
            {widgetEdition && (
              <WidgetConfigShow
                widget={widgetEdition}
                onDelete={() => {
                  const newWidgets = pageWidgets.filter(
                    (w) => w.id !== widgetEdition.id
                  );
                  setPageWidgets(newWidgets);
                  setWidgetEdition(null);
                }}
                onUpdate={(edited) => {
                  const newWidgets = pageWidgets.map((w) => {
                    if (w.id === edited.id) {
                      return edited;
                    }
                    return w;
                  });
                  setPageWidgets(newWidgets);
                  setWidgetEdition(null)
                }}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
