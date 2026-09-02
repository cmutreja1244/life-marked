"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState } from "react";
import { saveStory } from "@/lib/family/actions";
import type { TipTapNode } from "@/lib/platform/tiptap";

export function StoryEditor({
  memorialId,
  initial,
  pullQuote,
  disabled,
}: {
  memorialId: string;
  initial: TipTapNode | null;
  pullQuote: string;
  disabled?: boolean;
}) {
  const [quote, setQuote] = useState(pullQuote);
  const [status, setStatus] = useState(" ");
  const editor = useEditor({
    extensions: [StarterKit],
    content: initial ?? { type: "doc", content: [{ type: "paragraph" }] },
    editable: !disabled,
    immediatelyRender: false,
    onUpdate: ({ editor: instance }) => {
      setStatus("Saving");
      void saveStory(memorialId, instance.getJSON() as TipTapNode, quote)
        .then(() => setStatus("Saved"))
        .catch(() => setStatus("Couldn’t save — try again"));
    },
  });

  return (
    <div className="mt-6">
      <p className="text-sm text-warm-grey" aria-live="polite">{status}</p>
      <div className="mt-4 rounded-lg border border-border-warm bg-white/40 p-4">
        <EditorContent editor={editor} />
      </div>
      <label className="mt-6 block text-sm">
        Pull quote
        <input
          className="input-field mt-2"
          value={quote}
          disabled={disabled}
          onChange={(event) => {
            setQuote(event.target.value);
            if (editor) void saveStory(memorialId, editor.getJSON() as TipTapNode, event.target.value);
          }}
        />
      </label>
    </div>
  );
}
