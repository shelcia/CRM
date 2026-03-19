import { useState, useCallback, useEffect } from "react"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from "lexical"
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
  $isQuoteNode,
  HeadingTagType,
} from "@lexical/rich-text"
import { $setBlocksType } from "@lexical/selection"
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Undo2,
  Redo2,
} from "lucide-react"
import { ContentEditable } from "@/components/editor/editor-ui/content-editable"
import { cn } from "@/lib/utils"

// ── Toolbar primitives ────────────────────────────────────────────────────────

const ToolbarBtn = ({
  active,
  onClick,
  title,
  children,
}: {
  active?: boolean
  onClick: () => void
  title: string
  children: React.ReactNode
}) => (
  <button
    type="button"
    title={title}
    onMouseDown={(e) => {
      e.preventDefault() // keep editor focus
      onClick()
    }}
    className={cn(
      "flex items-center justify-center h-7 w-7 rounded text-sm transition-colors",
      active
        ? "bg-primary text-primary-foreground"
        : "text-muted-foreground hover:bg-muted hover:text-foreground",
    )}
  >
    {children}
  </button>
)

const Sep = () => <div className="h-4 w-px bg-border mx-0.5" />

// ── Toolbar plugin ─────────────────────────────────────────────────────────────

const ToolbarPlugin = () => {
  const [editor] = useLexicalComposerContext()
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)
  const [isStrikethrough, setIsStrikethrough] = useState(false)
  const [blockType, setBlockType] = useState("paragraph")

  const syncToolbar = useCallback(() => {
    const selection = $getSelection()
    if (!$isRangeSelection(selection)) return

    setIsBold(selection.hasFormat("bold"))
    setIsItalic(selection.hasFormat("italic"))
    setIsUnderline(selection.hasFormat("underline"))
    setIsStrikethrough(selection.hasFormat("strikethrough"))

    const anchor = selection.anchor.getNode()
    const element =
      anchor.getKey() === "root" ? anchor : anchor.getTopLevelElementOrThrow()

    if ($isHeadingNode(element)) {
      setBlockType(element.getTag())
    } else if ($isQuoteNode(element)) {
      setBlockType("quote")
    } else {
      setBlockType("paragraph")
    }
  }, [])

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        syncToolbar()
        return false
      },
      COMMAND_PRIORITY_LOW,
    )
  }, [editor, syncToolbar])

  const formatHeading = (tag: HeadingTagType) => {
    editor.update(() => {
      const selection = $getSelection()
      if (!$isRangeSelection(selection)) return
      $setBlocksType(selection, () =>
        blockType === tag ? $createParagraphNode() : $createHeadingNode(tag),
      )
    })
  }

  const formatQuote = () => {
    editor.update(() => {
      const selection = $getSelection()
      if (!$isRangeSelection(selection)) return
      $setBlocksType(selection, () =>
        blockType === "quote" ? $createParagraphNode() : $createQuoteNode(),
      )
    })
  }

  return (
    <div className="flex items-center gap-0.5 px-2 py-1.5 border-b flex-wrap">
      {/* Undo / Redo */}
      <ToolbarBtn title="Undo" onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}>
        <Undo2 className="h-3.5 w-3.5" />
      </ToolbarBtn>
      <ToolbarBtn title="Redo" onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}>
        <Redo2 className="h-3.5 w-3.5" />
      </ToolbarBtn>

      <Sep />

      {/* Inline formatting */}
      <ToolbarBtn active={isBold} title="Bold" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}>
        <Bold className="h-3.5 w-3.5" />
      </ToolbarBtn>
      <ToolbarBtn active={isItalic} title="Italic" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}>
        <Italic className="h-3.5 w-3.5" />
      </ToolbarBtn>
      <ToolbarBtn active={isUnderline} title="Underline" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}>
        <Underline className="h-3.5 w-3.5" />
      </ToolbarBtn>
      <ToolbarBtn active={isStrikethrough} title="Strikethrough" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough")}>
        <Strikethrough className="h-3.5 w-3.5" />
      </ToolbarBtn>

      <Sep />

      {/* Block type */}
      <ToolbarBtn active={blockType === "h1"} title="Heading 1" onClick={() => formatHeading("h1")}>
        <Heading1 className="h-3.5 w-3.5" />
      </ToolbarBtn>
      <ToolbarBtn active={blockType === "h2"} title="Heading 2" onClick={() => formatHeading("h2")}>
        <Heading2 className="h-3.5 w-3.5" />
      </ToolbarBtn>
      <ToolbarBtn active={blockType === "h3"} title="Heading 3" onClick={() => formatHeading("h3")}>
        <Heading3 className="h-3.5 w-3.5" />
      </ToolbarBtn>
      <ToolbarBtn active={blockType === "quote"} title="Quote" onClick={formatQuote}>
        <Quote className="h-3.5 w-3.5" />
      </ToolbarBtn>
    </div>
  )
}

// ── Composed plugins ───────────────────────────────────────────────────────────

export function Plugins() {
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null)

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem)
    }
  }

  return (
    <div className="relative">
      <ToolbarPlugin />
      <HistoryPlugin />
      <div className="relative">
        <RichTextPlugin
          contentEditable={
            <div ref={onRef}>
              <ContentEditable placeholder="Start typing..." />
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
      </div>
    </div>
  )
}
