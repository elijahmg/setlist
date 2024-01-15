'use client';

import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

interface Props {
  name: string;
  uniqueId?: string;
  activeList?: string;
}

export function Song({ name, uniqueId, activeList }: Props) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: name + '-' + (uniqueId ?? ''),
    data: {
      name,
      activeList
    }
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return <li ref={setNodeRef} style={style} {...listeners} {...attributes} className="flex bg-white rounded p-4">{name}</li>
}