const ALLOWED_MARKS = new Set(["bold", "italic", "link"]);
const ALLOWED_NODES = new Set(["doc", "paragraph", "text", "heading", "bulletList", "orderedList", "listItem", "blockquote", "hardBreak"]);

export type TipTapNode = {
  type: string;
  attrs?: Record<string, unknown>;
  content?: TipTapNode[];
  text?: string;
  marks?: Array<{ type: string; attrs?: Record<string, unknown> }>;
};

export function sanitiseTiptap(doc: unknown): TipTapNode {
  if (!doc || typeof doc !== "object") {
    return { type: "doc", content: [{ type: "paragraph" }] };
  }
  return sanitiseNode(doc as TipTapNode) ?? { type: "doc", content: [{ type: "paragraph" }] };
}

function sanitiseNode(node: TipTapNode): TipTapNode | null {
  if (!node?.type || !ALLOWED_NODES.has(node.type)) return null;

  const next: TipTapNode = { type: node.type };
  if (node.type === "heading") {
    const level = Number(node.attrs?.level ?? 2);
    next.attrs = { level: Math.min(3, Math.max(2, level)) };
  }
  if (node.text) next.text = node.text.slice(0, 50_000);
  if (node.marks) {
    next.marks = node.marks
      .filter((mark) => ALLOWED_MARKS.has(mark.type))
      .map((mark) => {
        if (mark.type === "link") {
          const href = String(mark.attrs?.href ?? "");
          if (!href.startsWith("https://") && !href.startsWith("mailto:")) return { type: "italic" };
          return { type: "link", attrs: { href } };
        }
        return { type: mark.type };
      });
  }
  if (node.content) {
    next.content = node.content.map(sanitiseNode).filter((child): child is TipTapNode => Boolean(child));
  }
  return next;
}

export function tiptapToParagraphs(doc: TipTapNode): string[] {
  const paragraphs: string[] = [];
  walk(doc, paragraphs);
  return paragraphs.map((text) => text.trim()).filter(Boolean);
}

function walk(node: TipTapNode, out: string[]) {
  if (node.type === "paragraph" || node.type === "heading") {
    out.push(collectText(node));
    return;
  }
  node.content?.forEach((child) => walk(child, out));
}

function collectText(node: TipTapNode): string {
  if (node.text) return node.text;
  return (node.content ?? []).map(collectText).join("");
}
