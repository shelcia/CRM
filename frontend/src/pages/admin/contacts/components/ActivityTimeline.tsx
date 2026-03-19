import { Activity } from "react";
import { INote } from "../types";
import { ActivityIcon } from "lucide-react";
import { NOTE_TYPE_META } from "../constants";
import { cn } from "@/lib/utils";
import { convertDateToDateWithTime } from "@/utils/calendarHelpers";

const ActivityTimeline = ({ notes }: { notes: INote[] }) => {
  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-2">
        <ActivityIcon className="h-8 w-8 opacity-30" />
        <p className="text-sm">No activity yet</p>
      </div>
    );
  }

  return (
    <ol className="relative border-l border-border ml-3 space-y-0">
      {notes.map((note) => {
        const meta = NOTE_TYPE_META[note.type] ?? NOTE_TYPE_META.note;
        return (
          <li key={note._id} className="mb-6 ml-5">
            <span className="absolute -left-[9px] flex items-center justify-center w-[18px] h-[18px] rounded-full bg-card border-2 border-primary">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            </span>
            <div className="flex items-start gap-2">
              <span
                className={cn(
                  "inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-medium shrink-0",
                  meta.color,
                )}
              >
                {meta.icon}
                {meta.label}
              </span>
              <time className="text-xs text-muted-foreground mt-0.5">
                {convertDateToDateWithTime(note.createdAt)}
              </time>
            </div>
            <p className="mt-1.5 text-sm text-foreground leading-relaxed">
              {note.body}
            </p>
            {note.author && (
              <p className="mt-0.5 text-xs text-muted-foreground">
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
