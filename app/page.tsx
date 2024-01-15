'use client';

import { Actions, ListId, songs, SongsMap, SongType } from "@/app/utils/songs";
import { Song } from "@/app/components/song";
import {
  DndContext,
  rectIntersection,
  Over,
  Active,
  CollisionDetection,
  pointerWithin,
  getFirstCollision, closestCenter, UniqueIdentifier
} from '@dnd-kit/core';
import { useCallback, useRef, useState } from "react";
import { Setlist } from "@/app/components/setlist";

const TRASH_ID = 'void';

export default function Home() {
  const [listOne, setListOne] = useState<SongsMap>(new Map())
  const [listTwo, setListTwo] = useState<SongsMap>(new Map())
  const [listThree, setListThree] = useState<SongsMap>(new Map())

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  const lastOverId = useRef<UniqueIdentifier | null>(null);
  const recentlyMovedToNewContainer = useRef(false);

  const actions: Actions = {
    "list-1": {
      state: listOne,
      action: setListOne,
    },
    "list-2": {
      state: listTwo,
      action: setListTwo,
    },
    "list-3": {
      state: listThree,
      action: setListThree,
    }
  }

  function handleDeleteItem(songName: string, activeList: ListId) {
    const { state, action } = actions[activeList];

    const newMap = new Map(state);

    newMap.delete(songName);
    action(newMap)
  }


  function handleOnDragEnd(over: Over | null, active: Active) {
    const parsedData = active.data.current as SongType;

    if (!over && !parsedData.activeList) return;

    if (!over && parsedData.activeList) {
      handleDeleteItem(parsedData.name, parsedData.activeList)
      return;
    }

    if (parsedData.activeList) {
      handleDeleteItem(parsedData.name, parsedData.activeList)
    }

    const { state, action } = actions[over!.id as keyof typeof actions];

    const newMap = new Map(state)

    newMap.set(parsedData.name, parsedData)

    action(newMap)
  }

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


  return (
    <DndContext
      collisionDetection={collisionDetectionStrategy}
      onDragEnd={({ over, active }) => {
        handleOnDragEnd(over, active)
      }}
      onDragStart={({ active }) => {
        setActiveId(active.id);
      }}
    >
      <main className="grid grid-cols-4 p-12 gap-2">
        <div className="z-10 max-w-5xl flex gap-1 flex-col">
          {songs.map(({ name }) => <Song key={name} name={name}/>)}
        </div>
        <Setlist id="1" droppableId="list-1">
          {listOne.size > 0 &&
            Array.from(listOne)
              .map(([id, value], index) => <Song activeList="list-1" uniqueId={index + '-list-1'} key={id}
                                                 name={value.name}/>)}
        </Setlist>
        <Setlist id="2" droppableId="list-2">
          {listTwo.size > 0 &&
            Array.from(listTwo)
              .map(([id, value], index) => <Song activeList="list-2" uniqueId={index + '-list-2'} key={id}
                                                 name={value.name}/>)}
        </Setlist>
        <Setlist id="3" droppableId="list-3">
          {listThree.size > 0 &&
            Array.from(listThree)
              .map(([id, value], index) => <Song activeList="list-3" uniqueId={index + '-list-3'} key={id}
                                                 name={value.name}/>)}
        </Setlist>
      </main>
    </DndContext>
  )
}


