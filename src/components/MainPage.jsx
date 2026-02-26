import { useState, useRef, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import Header from "./Header";
import Footer from "./Footer";
import Card from "./Card";
import data from "../data.json";
import organizations from "../organizations";

export default function MainPage() {
  const [userOrganizations, setUserOrganizations] = useState(() => {
    const base = data.userOrganizations.map((userOrg) => {
      const org = organizations.find(
        (org) => org.id === userOrg.organizationId
      );
      return {
        ...userOrg,
        logo: org?.logo,
      };
    });

    if (typeof window === "undefined") {
      return base;
    }

    try {
      const saved = window.localStorage.getItem("cardsOrder");
      if (!saved) return base;

      const order = JSON.parse(saved);
      if (!Array.isArray(order)) return base;

      const byId = new Map(base.map((item) => [item.id, item]));

      const ordered = order
        .map((id) => byId.get(id))
        .filter(Boolean);

      const remaining = base.filter((item) => !order.includes(item.id));

      return [...ordered, ...remaining];
    } catch {
      return base;
    }
  });

  const [isMoveMode, setIsMoveMode] = useState(false);
  const justDraggedRef = useRef(false);

  function handleDragStart() {
    justDraggedRef.current = true;
  }

  function handleDragEnd(result) {
    // Сбрасываем флаг с задержкой при любом завершении перетаскивания
    setTimeout(() => {
      justDraggedRef.current = false;
    }, 400);

    if (!result.destination) return;
    if (result.destination.index === result.source.index) return;

    setUserOrganizations((prev) => {
      const items = [...prev];
      const [removed] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, removed);

      if (typeof window !== "undefined") {
        const order = items.map((item) => item.id);
        window.localStorage.setItem("cardsOrder", JSON.stringify(order));
      }

      return items;
    });
  }

  function handleEnterMoveMode() {
    setIsMoveMode(true);
  }

  useEffect(() => {
    if (!isMoveMode) return;

    function handleClickOutside(event) {
      if (justDraggedRef.current) return;

      const onCard = event.target.closest("[data-card]");
      const onMenu = event.target.closest("[data-headlessui-state]");

      if (!onCard && !onMenu) {
        setIsMoveMode(false);
      }
    }

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isMoveMode]);

  return (
    <div className="flex flex-col justify-between items-center h-full">
      <Header />

      <DragDropContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
        {/* Внешний контейнер: окно с горизонтальным скроллом */}
        <div className="w-full overflow-x-auto">
          <Droppable droppableId="cards" direction="horizontal">
            {(provided) => (
              // Внутренний контейнер: горизонтальная лента карточек
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex flex-nowrap items-start gap-4 px-4 py-4"
              >
                {userOrganizations.map((organization, index) => (
                  <Draggable
                    key={organization.id}
                    draggableId={String(organization.id)}
                    index={index}
                    isDragDisabled={!isMoveMode}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        data-card
                      >
                        <Card
                          logo={organization.logo}
                          organizationName={organization.organizationName}
                          categories={organization.categories}
                          isMoveMode={isMoveMode}
                          onEnterMoveMode={handleEnterMoveMode}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>

      <div className="flex flex-row justify-center items-start">
        <Footer />
      </div>
    </div>
  );
}
