'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { UniqueIdentifier } from "@dnd-kit/core";

interface Props {
  id: UniqueIdentifier;
  name: string;
}

export function Song({ id, name }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return <li ref={setNodeRef} style={style} {...listeners} {...attributes}
             className="flex bg-white rounded p-4 box-border">{name}</li>
}
