'use client';

import React from 'react';
import { ListId, songs, SongType } from "@/app/utils/songs";
import { Song } from "@/app/components/song";
import {
  Active,
  CollisionDetection,
  DndContext,
  getFirstCollision,
  KeyboardSensor,
  MouseSensor,
  Over,
  PointerSensor,
  pointerWithin,
  rectIntersection,
  UniqueIdentifier,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { useCallback, useRef, useState } from "react";
import { Setlist } from "@/app/components/setlist";

import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

const TRASH_ID = 'void';

type Items = Record<UniqueIdentifier, SongType[]>;

export default function Home() {

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [items, setItems] = useState<Items>({
    default: songs,
    ['list-1']: [],
    ['list-2']: [],
    ['list-3']: [],
  });
  const [clonedItems, setClonedItems] = useState<Items | null>(null);

  const containers = Object.keys(items);

  const lastOverId = useRef<UniqueIdentifier | null>(null);
  const recentlyMovedToNewContainer = useRef(false);

  function handleDeleteItem(songName: string, activeList: ListId) {

  }

  function onDragOver(over: Over | null, active: Active) {
    const overId = over?.id;

    if (overId == null || overId === TRASH_ID || active.id in items) {
      return;
    }

    const overContainer = findContainer(overId);
    const activeContainer = findContainer(active.id);


    if (!overContainer || !activeContainer) {
      return;
    }

    if (activeContainer !== overContainer) {
      setItems((items) => {
        const activeItems = items[activeContainer];
        const overItems = items[overContainer];
        const overIndex = overItems.findIndex(({ id }) => id === overId);
        const activeIndex = activeItems.findIndex(({ id }) => id === active.id);

        let newIndex: number;

        if (overId in items) {
          newIndex = overItems.length + 1;
        } else {
          const isBelowOverItem =
            over &&
            active.rect.current.translated &&
            active.rect.current.translated.top >
            over.rect.top + over.rect.height;

          const modifier = isBelowOverItem ? 1 : 0;

          newIndex =
            overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
        }

        recentlyMovedToNewContainer.current = true;

        return {
          ...items,
          [activeContainer]: items[activeContainer].filter(
            (item) => item.id !== active.id
          ),
          [overContainer]: [
            ...items[overContainer].slice(0, newIndex),
            items[activeContainer][activeIndex],
            ...items[overContainer].slice(
              newIndex,
              items[overContainer].length
            ),
          ],
        };
      });
    }
  }


  function handleOnDragEnd(over: Over | null, active: Active) {
    const activeContainer = findContainer(active.id);

    console.log({over, active})

    if (!activeContainer) {
      setActiveId(null);
      return;
    }

    const overId = over?.id;

    if (overId == null) {
      setActiveId(null);
      return;
    }

    const overContainer = findContainer(overId);

    if (overContainer) {
      const activeIndex = items[activeContainer].findIndex(({ id }) => id === active.id);
      const overIndex = items[overContainer].findIndex(({ id }) => id === overId);

      if (activeIndex !== overIndex) {
        setItems((items) => ({
          ...items,
          [overContainer]: arrayMove(
            items[overContainer],
            activeIndex,
            overIndex
          ),
        }));
      }
    }

    setActiveId(null);
  }

  const findContainer = (id: UniqueIdentifier) => {
    if (id in items) {
      return id;
    }

    return Object.keys(items).find((key) => items[key].some(({ id: songId }) => songId === id));
  };

  const getIndex = (id: UniqueIdentifier) => {
    const container = findContainer(id);

    if (!container) {
      return -1;
    }

    return items[container].findIndex(({ id: songId }) => id === songId);
  };

  /**
   * Custom collision detection strategy optimized for multiple containers
   *
   * - First, find any droppable containers intersecting with the pointer.
   * - If there are none, find intersecting containers with the active draggable.
   * - If there are no intersecting containers, return the last matched intersection
   *
   */
  const collisionDetectionStrategy: CollisionDetection = useCallback(
    (args) => {
      // Start by finding any intersecting droppable
      const pointerIntersections = pointerWithin(args);

      const containers = rectIntersection(args)
        .filter(({ data }) => data?.value > 0.05);

      const intersections =
        pointerIntersections.length > 0 ? pointerIntersections : containers;

      const overId = getFirstCollision(intersections, 'id');

      if (overId != null) {
        if (overId === TRASH_ID) {
          // If the intersecting droppable is the trash, return early
          // Remove this if you're not using trashable functionality in your app
          return intersections;
        }

        lastOverId.current = overId;

        return [{ id: overId }];
      }

      // When a draggable item moves to a new container, the layout may shift
      // and the `overId` may become `null`. We manually set the cached `lastOverId`
      // to the id of the draggable item that was moved to the new container, otherwise
      // the previous `overId` will be returned which can cause items to incorrectly shift positions
      if (recentlyMovedToNewContainer.current) {
        lastOverId.current = activeId;
      }

      // If no droppable is matched, return the last match
      return [];
    },
    [activeId]
  );

  const onDragCancel = () => {
    if (clonedItems) {
      // Reset items to their original state in case items have been
      // Dragged across containers
      setItems(clonedItems);
    }

    setActiveId(null);
    setClonedItems(null);
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(MouseSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetectionStrategy}
      onDragCancel={onDragCancel}
      onDragEnd={({ over, active }) => {
        handleOnDragEnd(over, active)
      }}
      onDragOver={({ over, active }) => {
        onDragOver(over, active)
      }}
      onDragStart={({ active }) => {
        setActiveId(active.id);
        setClonedItems(items);
      }}
    >
      <main className="inline-grid px-12 pt-6 gap-2 grid-flow-col w-full grid-cols-4">
        {containers.map((containerId, index) => (
          <React.Fragment key={containerId}>
            <SortableContext
              items={items[containerId]}
              strategy={verticalListSortingStrategy}
            >
              <Setlist id={index} droppableId={containerId}>
                {items[containerId].map(({ name, id }) => <Song id={id} key={name} name={name}/>)}
              </Setlist>
            </SortableContext>
          </React.Fragment>
        ))}
      </main>
    </DndContext>
  )
}


