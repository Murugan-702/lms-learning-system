import { Editor } from "@tiptap/react";
import { EditorToggleButton } from "./EditorToggleButton";
import {
  Bold, Italic, Strikethrough,
  Heading1Icon, Heading2Icon, Heading3Icon,
  ListIcon, ListOrdered,
  AlignLeft, AlignCenter, AlignRight,
  Undo, Redo,
  Heading4Icon
} from "lucide-react";
import { TooltipProvider } from "../ui/tooltip";
import { Button } from "../ui/button";

export function Menubar({ editor }: { editor: Editor | null }) {
  if (!editor) return null;

  const buttons = [
    { icon: <Bold />, label: "Bold", active: editor.isActive("bold"), action: () => editor.chain().focus().toggleBold().run() },
    { icon: <Italic />, label: "Italic", active: editor.isActive("italic"), action: () => editor.chain().focus().toggleItalic().run() },
    { icon: <Strikethrough />, label: "Strike", active: editor.isActive("strike"), action: () => editor.chain().focus().toggleStrike().run() },

    { icon: <Heading1Icon />, label: "Heading 1", active: editor.isActive("heading", { level: 1 }), action: () => editor.chain().focus().toggleHeading({ level: 1 }).run() },
    { icon: <Heading2Icon />, label: "Heading 2", active: editor.isActive("heading", { level: 2 }), action: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
    { icon: <Heading3Icon />, label: "Heading 3", active: editor.isActive("heading", { level: 3 }), action: () => editor.chain().focus().toggleHeading({ level: 3 }).run() },
    { icon: <Heading4Icon />, label: "Heading 4", active: editor.isActive("heading", { level: 3 }), action: () => editor.chain().focus().toggleHeading({ level: 4 }).run() },
 

    { icon: <ListIcon />, label: "Bullet List", active: editor.isActive("bulletList"), action: () => editor.chain().focus().toggleBulletList().run() },
    { icon: <ListOrdered />, label: "Ordered List", active: editor.isActive("orderedList"), action: () => editor.chain().focus().toggleOrderedList().run() },

    { icon: <AlignLeft />, label: "Align Left", active: editor.isActive({ textAlign: "left" }), action: () => editor.chain().focus().setTextAlign("left").run() },
    { icon: <AlignCenter />, label: "Align Center", active: editor.isActive({ textAlign: "center" }), action: () => editor.chain().focus().setTextAlign("center").run() },
    { icon: <AlignRight />, label: "Align Right", active: editor.isActive({ textAlign: "right" }), action: () => editor.chain().focus().setTextAlign("right").run() },
  ];

  return (
    <div className="border border-input border-t-0 border-x-0 rounded-t-lg p-2 bg-card flex flex-wrap gap-1 items-center">
      <TooltipProvider>
        {buttons.map((btn, i) => (
          <EditorToggleButton
            key={i}
            icon={btn.icon}
            label={btn.label}
            isActive={btn.active}
            onClick={btn.action}
          />
        ))}

        <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
          <Undo />
        </Button>

        <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
          <Redo />
        </Button>
      </TooltipProvider>
    </div>
  );
}
