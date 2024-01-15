import { useDroppable } from "@dnd-kit/core";
import React from "react";

interface Props {
  children: React.ReactNode;
  droppableId: string;
  id: string;
}


export function Setlist({ children, droppableId, id }: Props) {
  const { setNodeRef } = useDroppable({
    id: droppableId,
  });

  return (
    <div className="rounded bg-gray-100" ref={setNodeRef} style={{
      minHeight: '400px'
    }}>
      <h2 className="rounded-t bg-white font-sans px-3 py-3 border-b-amber-400 border-b-2">
        Set {id}
      </h2>
      <ul className="grid gap-2 p-4  rounded list-none">
        {children}
      </ul>
    </div>
  );
}