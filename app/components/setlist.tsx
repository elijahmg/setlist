import React from "react";
import { CSS } from '@dnd-kit/utilities';
import { AnimateLayoutChanges, defaultAnimateLayoutChanges, useSortable } from "@dnd-kit/sortable";

interface Props {
  children: React.ReactNode;
  droppableId: string;
  id: number;
}

const animateLayoutChanges: AnimateLayoutChanges = (args) =>
  defaultAnimateLayoutChanges({ ...args, wasDragging: true });


export function Setlist({ children, droppableId, id }: Props) {
  const {
    active,
    attributes,
    isDragging,
    listeners,
    over,
    setNodeRef,
    transition,
    transform,
  } = useSortable({
    id: droppableId,
    data: {
      type: 'container',
      children,
    },
    animateLayoutChanges,
  });

  return (
    <div
      style={{
        transition,
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : undefined,
      }}
      {...listeners}
      {...attributes}
      className="rounded bg-gray-100 max-h-[90vh] overflow-hidden flex flex-col"
      ref={setNodeRef}>
      <h2 className="rounded-t bg-white font-sans px-3 py-3 border-b-amber-400 border-b-2">
        {id ? `Set ${id}` : 'All songs'}
      </h2>
      <ul className="grid gap-2 p-4 rounded list-none overflow-y-auto">
        {children}
      </ul>
    </div>
  );
}