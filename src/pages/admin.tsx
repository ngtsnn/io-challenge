import { useRouter } from "next/router";
import { Button } from "@/atoms/Button";
import { LinkBtn } from "@/atoms/LinkBtn";
import widgets from "@/configs/widgets";
import { WidgetIcon } from "@/components/WidgetIcon";
import { DragEventHandler, useEffect, useRef, useState } from "react";
import { ExportModal } from "@/components/ExportModal";
import { ImportModal } from "@/components/ImportModal";
import axios from "axios";

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
  onAbort: () => unknown;
}

const WidgetShow = ({ widget, onSelected }: WidgetShow) => {
  const { name, state } = widget;
  switch (name) {
    case "button": {
      return <Button className="w-fit" onClick={() => onSelected(widget)}>{state?.btnText}</Button>;
    }
    case "paragraph": {
      return <div onClick={() => onSelected(widget)}>{state?.text}</div>;
    }
  }
};

const WidgetConfigShow = ({ widget, onDelete, onUpdate, onAbort }: WidgetConfig) => {
  const [state, setState] = useState(widget.state);

  useEffect(() => {
    setState(widget.state);
  }, [widget.id]);

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
        <Button varient="success" onClick={() => onUpdate({ ...widget, state })}>Update</Button>
        <Button varient="danger" onClick={onDelete}>
          Delete
        </Button>
        <Button varient="primary" onClick={onAbort}>
          Abort
        </Button>
      </div>
    </div>
  );
};

const CHANGE_STACK_COUNT = 100;

export default function Admin() {
  const router = useRouter();

  const editTableRef = useRef<HTMLDivElement>(null);
  const [draggedEle, setDraggedEle] = useState<string | null>(null);
  const [showExport, setShowExport] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [mousePos, setMousePos] = useState({
    x: 0,
    y: 0,
  });
  const [pageWidgets, setPageWidgets] = useState<Widget[]>([]);
  const [widgetEdition, setWidgetEdition] = useState<Widget | null>(null);
  const lastChangeRef = useRef<Array<Widget[]>>([]);
  const redoStackRef = useRef<Array<Widget[]>>([]);

  const onSave = () => {
    axios.post("/api/configs", {
      config: pageWidgets
    }).then(() => alert('Saved successfully')).catch(() => alert('Error to save'));
  };
  const undo = () => {
    const lastChanges = lastChangeRef.current;
    const redoStack = redoStackRef.current
    const lastChange = lastChanges.pop();
    if (lastChange) {
      redoStack.push(pageWidgets);
      setPageWidgets(lastChange);
    }
    lastChangeRef.current = lastChanges;
    redoStackRef.current = redoStack;
  };
  const redo = () => {
    const lastChanges = lastChangeRef.current;
    const redoStack = redoStackRef.current;
    const fastfowardedChange = redoStack.pop();
    if (fastfowardedChange) {
      lastChanges.push(pageWidgets);
      setPageWidgets(fastfowardedChange);
    }
    lastChangeRef.current = lastChanges;
    redoStackRef.current = redoStack;
  };
  const onImport = () => {
    setShowImport(true);
  };
  const onExport = () => {
    setShowExport(true)
  };

  const UpdateWidgets = (_widgets: Widget[]) => {
    const lastChanges = lastChangeRef.current;
    lastChanges.push(pageWidgets);
    if (lastChanges.length > CHANGE_STACK_COUNT) {
      lastChanges.shift();
    }
    lastChangeRef.current = lastChanges;
    redoStackRef.current = [];
    setPageWidgets(_widgets);
  }

  const onDrop: DragEventHandler<HTMLDivElement> = (e) => {
    if (!draggedEle) {
      return null;
    }

    const widget = widgets.find((w) => w.name === draggedEle);
    if (widget) {
      UpdateWidgets([
        ...pageWidgets,
        {
          id: Date.now(),
          name: widget.name,
          state: widget.defaultState,
        },
      ]);
    }

    setDraggedEle(null);
  };

  useEffect(() => {
    function MouseMove(e: MouseEvent) {
      const {x, y} = e;
      setMousePos({x, y})
    }
    window.addEventListener("mousemove", MouseMove);

    axios.get("/api/configs").then(({ data }) => {
      setPageWidgets(data);
    }).catch()

    return () => {
      window.removeEventListener('mousemove', MouseMove)
    };
  }, []);

  return (
    <main className="min-h-screen flex flex-col">
      <div className="h-6"></div>
      <div className="flex justify-center space-x-2">
        <Button onClick={onSave}>Save</Button>
        <Button onClick={undo}>Undo</Button>
        <Button onClick={redo}>Redo</Button>
        <Button onClick={onImport}>Import</Button>
        <Button onClick={onExport}>Export</Button>
        <LinkBtn href="/consumer">View</LinkBtn>
      </div>
      <div className="h-2"></div>
      <div className="flex border-t flex-1">
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
                  setTimeout(() => setDraggedEle(null), 200);
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
            className="border-b p-4 min-h-[70vh] relative"
            ref={editTableRef}
          >
            <div className="absolute left-6 bottom-6 flex flex-col space-y-1 z-0">
              <div>Mouse position: {`(${mousePos.x}, ${mousePos.y})`}</div>
              <div>Dragging: {draggedEle}</div>
              <div>instances: {pageWidgets.length}</div>
              <div>Config: {widgetEdition && JSON.stringify(widgetEdition, null, "  ")}</div>
            </div>
            <div className="relative z-10 flex flex-col items-center ">
              {pageWidgets.map((w) => {
                return (
                  <WidgetShow
                    widget={w}
                    onSelected={(w) => {
                      setWidgetEdition(w);
                    }}
                    key={w.id}
                  />
                );
              })}
            </div>
          </div>
          <div className="p-4">
            {widgetEdition && (
              <WidgetConfigShow
                widget={widgetEdition}
                onDelete={() => {
                  const newWidgets = pageWidgets.filter((w) => w.id !== widgetEdition.id);
                  UpdateWidgets(newWidgets);
                  setWidgetEdition(null);
                }}
                onUpdate={(edited) => {
                  const newWidgets = pageWidgets.map((w) => {
                    if (w.id === edited.id) {
                      return edited;
                    }
                    return w;
                  });
                  UpdateWidgets(newWidgets);
                  setWidgetEdition(null);
                }}
                onAbort={() => setWidgetEdition(null)}
              />
            )}
          </div>
        </div>
      </div>
      {showExport && (
        <ExportModal config={pageWidgets} isVisible onClose={() => setShowExport(false)} />
      )}
      {showImport && (
        <ImportModal onImport={UpdateWidgets} isVisible onClose={() => setShowImport(false)} />
      )}
    </main>
  );
}
