import { useState, useRef, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import Header from "./Header";
import Footer from "./Footer";
import Card from "./Card";
import data from "../data.json";
import organizations from "../organizations";

export default function MainPage() {
  const [userOrganizations, setUserOrganizations] = useState(() => {
    return data.userOrganizations.map((userOrg) => {
      const org = organizations.find(
        (org) => org.id === userOrg.organizationId
      );
      return {
        ...userOrg,
        logo: org?.logo,
      };
    });
  });

  const [isMoveMode, setIsMoveMode] = useState(false);
  const cardsRef = useRef(null);
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
        <div className="flex justify-center w-full h-full">
          <Droppable droppableId="cards" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex justify-center items-start w-full h-full gap-4 m-10"
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
