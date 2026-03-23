import { INote } from "../types";
import { ActivityIcon } from "lucide-react";
import { CustomEmptyState } from "@/components/custom";
import { NOTE_TYPE_META } from "../constants";
import { cn } from "@/lib/utils";
import { convertDateToDateWithTime } from "@/utils";

const ActivityTimeline = ({ notes }: { notes: INote[] }) => {
  if (notes.length === 0) {
    return <CustomEmptyState compact icon={ActivityIcon} title="No activity yet" className="py-16" />;
  }

  return (
    <ol className="relative border-l border-border ml-3 space-y-0">
      {notes.map((note) => {
        const isSystem = note.type === "activity";
        const meta = NOTE_TYPE_META[note.type] ?? NOTE_TYPE_META.note;
        return (
          <li key={note._id} className="mb-6 ml-5">
            <span
              className={cn(
                "absolute -left-[9px] flex items-center justify-center w-[18px] h-[18px] rounded-full border-2",
                isSystem
                  ? "bg-card border-muted-foreground/30"
                  : "bg-card border-primary",
              )}
            >
              <span
                className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  isSystem ? "bg-muted-foreground/40" : "bg-primary",
                )}
              />
            </span>

            <div className="flex items-center gap-2">
              {isSystem ? (
                <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">
                  System
                </span>
              ) : (
                <span
                  className={cn(
                    "inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-medium shrink-0",
                    meta.color,
                  )}
                >
                  {meta.icon}
                  {meta.label}
                </span>
              )}
              <time className="text-xs text-muted-foreground">
                {convertDateToDateWithTime(note.createdAt)}
              </time>
            </div>

            <p
              className={cn(
                "mt-1.5 text-sm leading-relaxed",
                isSystem ? "text-muted-foreground italic" : "text-foreground",
              )}
            >
              {note.body}
            </p>

            {note.author && !isSystem && (
              <p className="mt-0.5 text-xs text-muted-foreground">
                by {note.author}
              </p>
            )}
            {note.author && isSystem && (
              <p className="mt-0.5 text-xs text-muted-foreground/60">
                by {note.author}
              </p>
            )}
          </li>
        );
      })}
    </ol>
  );
};

export default ActivityTimeline;
