import { useState, useRef, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import Header from "./Header";
import Footer from "./Footer";
import Card from "./Card";
import AddCategoryModal from "./AddCategoryModal";
import data from "../data.json";
import organizations from "../organizations";

const STORAGE_KEY = "cardsData";

function loadUserOrganizations() {
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
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return base;

    const parsed = JSON.parse(saved);
    if (!parsed?.userOrganizations || !Array.isArray(parsed.userOrganizations)) {
      return base;
    }

    return parsed.userOrganizations.map((userOrg) => {
      const org = organizations.find(
        (o) => o.id === userOrg.organizationId
      );
      return {
        ...userOrg,
        logo: org?.logo,
      };
    });
  } catch {
    return base;
  }
}

function saveUserOrganizations(items) {
  if (typeof window === "undefined") return;
  const toSave = items.map(({ logo, ...rest }) => rest);
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ userOrganizations: toSave })
  );
}

export default function MainPage() {
  const [userOrganizations, setUserOrganizations] = useState(loadUserOrganizations);

  const [isMoveMode, setIsMoveMode] = useState(false);
  const [editingCardId, setEditingCardId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCardId, setModalCardId] = useState(null);
  const justDraggedRef = useRef(false);

  function handleEditClick(cardId) {
    setEditingCardId(cardId);
  }

  function handlePlusClick(cardId) {
    setModalCardId(cardId);
    setModalOpen(true);
  }

  function handleAddCategory(cardId, newCategory) {
    setUserOrganizations((prev) => {
      const items = prev.map((item) =>
        item.id === cardId
          ? {
              ...item,
              categories: [...item.categories, newCategory],
            }
          : item
      );
      saveUserOrganizations(items);
      return items;
    });
  }

  function handleModalClose() {
    setModalOpen(false);
    setModalCardId(null);
  }

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
      saveUserOrganizations(items);
      return items;
    });
  }

  function handleEnterMoveMode() {
    setIsMoveMode(true);
  }

  useEffect(() => {
    if (!isMoveMode && editingCardId === null) return;

    function handleClickOutside(event) {
      if (justDraggedRef.current) return;

      const onCard = event.target.closest("[data-card]");
      const onMenu = event.target.closest("[data-headlessui-state]");
      const onModal = event.target.closest("[data-add-category-modal]");

      if (!onCard && !onMenu && !onModal) {
        setIsMoveMode(false);
        setEditingCardId(null);
      }
    }

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isMoveMode, editingCardId]);

  return (
    <div className="flex flex-col justify-between items-center h-full">
      <Header />

      <DragDropContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
        {/* Внешний контейнер: окно с горизонтальным скроллом */}
        <div className="w-full overflow-x-auto no-scrollbar">
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
                        className="focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
                      >
                        <Card
                          id={organization.id}
                          logo={organization.logo}
                          organizationName={organization.organizationName}
                          categories={organization.categories}
                          isMoveMode={isMoveMode}
                          isEditMode={editingCardId !== null}
                          onEnterMoveMode={handleEnterMoveMode}
                          onEditClick={() => handleEditClick(organization.id)}
                          onPlusClick={() => handlePlusClick(organization.id)}
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

      <AddCategoryModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        onSubmit={(newCategory) =>
          modalCardId && handleAddCategory(modalCardId, newCategory)
        }
        organizationName={
          userOrganizations.find((o) => o.id === modalCardId)?.organizationName ??
          ""
        }
        existingCategoryIds={
          userOrganizations.find((o) => o.id === modalCardId)?.categories?.map(
            (c) => c.categoryId
          ) ?? []
        }
      />
    </div>
  );
}
