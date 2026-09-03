"use client";

import { useEffect, useRef, useState } from "react";

function bump(form: HTMLFormElement | null) {
  form?.dispatchEvent(new Event("input", { bubbles: true }));
}

function ItemBar({
  onUp,
  onDown,
  onRemove,
  canUp,
  canDown,
}: {
  onUp: () => void;
  onDown: () => void;
  onRemove: () => void;
  canUp: boolean;
  canDown: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <button type="button" className="btn-secondary min-h-10 px-3 text-sm" onClick={onUp} disabled={!canUp}>
        Move up
      </button>
      <button type="button" className="btn-secondary min-h-10 px-3 text-sm" onClick={onDown} disabled={!canDown}>
        Move down
      </button>
      <button type="button" className="btn-secondary min-h-10 px-3 text-sm" onClick={onRemove}>
        Remove
      </button>
    </div>
  );
}

function moveItem<T>(items: T[], index: number, direction: -1 | 1) {
  const next = index + direction;
  if (next < 0 || next >= items.length) return items;
  const copy = [...items];
  const [item] = copy.splice(index, 1);
  copy.splice(next, 0, item!);
  return copy;
}

export function TimelineEditor({
  name,
  initial,
}: {
  name: string;
  initial: Array<{ year: string; title: string; detail: string }>;
}) {
  const formRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState(initial.length ? initial : [{ year: "", title: "", detail: "" }]);
  const skip = useRef(true);
  useEffect(() => {
    if (skip.current) {
      skip.current = false;
      return;
    }
    bump(formRef.current?.form ?? null);
  }, [items]);

  const commit = (next: typeof items) => {
    setItems(next);
  };

  return (
    <div className="mt-6 space-y-4">
      <input ref={formRef} type="hidden" name={name} value={JSON.stringify(items)} />
      {items.map((item, index) => (
        <div key={index} className="rounded-lg border border-border-warm p-4">
          <p className="text-sm text-warm-grey">Moment {index + 1}</p>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            <label className="block text-sm">
              Year
              <input
                className="input-field mt-2"
                value={item.year}
                onChange={(event) => commit(items.map((row, i) => (i === index ? { ...row, year: event.target.value } : row)))}
                placeholder="1963"
              />
            </label>
            <label className="block text-sm md:col-span-2">
              Title
              <input
                className="input-field mt-2"
                value={item.title}
                onChange={(event) => commit(items.map((row, i) => (i === index ? { ...row, title: event.target.value } : row)))}
                placeholder="Married James"
              />
            </label>
          </div>
          <label className="mt-3 block text-sm">
            What happened
            <textarea
              className="input-field mt-2 h-24"
              value={item.detail}
              onChange={(event) => commit(items.map((row, i) => (i === index ? { ...row, detail: event.target.value } : row)))}
            />
          </label>
          <div className="mt-4">
            <ItemBar
              canUp={index > 0}
              canDown={index < items.length - 1}
              onUp={() => commit(moveItem(items, index, -1))}
              onDown={() => commit(moveItem(items, index, 1))}
              onRemove={() => commit(items.filter((_, i) => i !== index))}
            />
          </div>
        </div>
      ))}
      <button
        type="button"
        className="btn-secondary"
        onClick={() => commit([...items, { year: "", title: "", detail: "" }])}
      >
        Add a life moment
      </button>
    </div>
  );
}

export function FavouritesEditor({ name, initial }: { name: string; initial: string[] }) {
  const formRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState(initial.length ? initial : [""]);
  const skip = useRef(true);
  useEffect(() => {
    if (skip.current) {
      skip.current = false;
      return;
    }
    bump(formRef.current?.form ?? null);
  }, [items]);
  const commit = (next: string[]) => {
    setItems(next);
  };

  return (
    <div className="mt-6 space-y-3">
      <input ref={formRef} type="hidden" name={name} value={JSON.stringify(items)} />
      {items.map((item, index) => (
        <div key={index} className="rounded-lg border border-border-warm p-4">
          <label className="block text-sm">
            Favourite {index + 1}
            <input
              className="input-field mt-2"
              value={item}
              onChange={(event) => commit(items.map((row, i) => (i === index ? event.target.value : row)))}
              placeholder="Sunday roast"
            />
          </label>
          <div className="mt-4">
            <ItemBar
              canUp={index > 0}
              canDown={index < items.length - 1}
              onUp={() => commit(moveItem(items, index, -1))}
              onDown={() => commit(moveItem(items, index, 1))}
              onRemove={() => commit(items.filter((_, i) => i !== index))}
            />
          </div>
        </div>
      ))}
      <button type="button" className="btn-secondary" onClick={() => commit([...items, ""])}>
        Add a favourite
      </button>
    </div>
  );
}

export function MemoriesEditor({
  name,
  initial,
}: {
  name: string;
  initial: Array<{ quote: string; author: string }>;
}) {
  const formRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState(initial.length ? initial : [{ quote: "", author: "" }]);
  const skip = useRef(true);
  useEffect(() => {
    if (skip.current) {
      skip.current = false;
      return;
    }
    bump(formRef.current?.form ?? null);
  }, [items]);
  const commit = (next: typeof items) => {
    setItems(next);
  };

  return (
    <div className="mt-6 space-y-4">
      <input ref={formRef} type="hidden" name={name} value={JSON.stringify(items)} />
      {items.map((item, index) => (
        <div key={index} className="rounded-lg border border-border-warm p-4">
          <p className="text-sm text-warm-grey">Memory {index + 1}</p>
          <label className="mt-3 block text-sm">
            What they said
            <textarea
              className="input-field mt-2 h-28"
              value={item.quote}
              onChange={(event) => commit(items.map((row, i) => (i === index ? { ...row, quote: event.target.value } : row)))}
            />
          </label>
          <label className="mt-3 block text-sm">
            Who said it
            <input
              className="input-field mt-2"
              value={item.author}
              onChange={(event) => commit(items.map((row, i) => (i === index ? { ...row, author: event.target.value } : row)))}
              placeholder="Sarah, granddaughter"
            />
          </label>
          <div className="mt-4">
            <ItemBar
              canUp={index > 0}
              canDown={index < items.length - 1}
              onUp={() => commit(moveItem(items, index, -1))}
              onDown={() => commit(moveItem(items, index, 1))}
              onRemove={() => commit(items.filter((_, i) => i !== index))}
            />
          </div>
        </div>
      ))}
      <button type="button" className="btn-secondary" onClick={() => commit([...items, { quote: "", author: "" }])}>
        Add a memory
      </button>
    </div>
  );
}

export function PlacesEditor({
  name,
  initial,
}: {
  name: string;
  initial: Array<{ heading: string; location: string; text: string; caption: string }>;
}) {
  const formRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState(
    initial.length ? initial : [{ heading: "A place they loved", location: "", text: "", caption: "" }],
  );
  const skip = useRef(true);
  useEffect(() => {
    if (skip.current) {
      skip.current = false;
      return;
    }
    bump(formRef.current?.form ?? null);
  }, [items]);
  const commit = (next: typeof items) => {
    setItems(next);
  };

  return (
    <div className="mt-6 space-y-4">
      <input ref={formRef} type="hidden" name={name} value={JSON.stringify(items)} />
      {items.map((item, index) => (
        <div key={index} className="rounded-lg border border-border-warm p-4">
          <p className="text-sm text-warm-grey">Place {index + 1}</p>
          <label className="mt-3 block text-sm">
            Heading
            <input
              className="input-field mt-2"
              value={item.heading}
              onChange={(event) => commit(items.map((row, i) => (i === index ? { ...row, heading: event.target.value } : row)))}
            />
          </label>
          <label className="mt-3 block text-sm">
            Location
            <input
              className="input-field mt-2"
              value={item.location}
              onChange={(event) => commit(items.map((row, i) => (i === index ? { ...row, location: event.target.value } : row)))}
              placeholder="Florence, Italy"
            />
          </label>
          <label className="mt-3 block text-sm">
            Why it mattered
            <textarea
              className="input-field mt-2 h-28"
              value={item.text}
              onChange={(event) => commit(items.map((row, i) => (i === index ? { ...row, text: event.target.value } : row)))}
            />
          </label>
          <label className="mt-3 block text-sm">
            Photograph caption
            <input
              className="input-field mt-2"
              value={item.caption}
              onChange={(event) => commit(items.map((row, i) => (i === index ? { ...row, caption: event.target.value } : row)))}
            />
          </label>
          <div className="mt-4">
            <ItemBar
              canUp={index > 0}
              canDown={index < items.length - 1}
              onUp={() => commit(moveItem(items, index, -1))}
              onDown={() => commit(moveItem(items, index, 1))}
              onRemove={() => commit(items.filter((_, i) => i !== index))}
            />
          </div>
        </div>
      ))}
      <button
        type="button"
        className="btn-secondary"
        onClick={() => commit([...items, { heading: "A place they loved", location: "", text: "", caption: "" }])}
      >
        Add a place
      </button>
    </div>
  );
}
