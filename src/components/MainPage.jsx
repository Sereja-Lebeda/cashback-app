import { useState, useRef, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import Header from "./Header";
import Footer from "./Footer";
import Card from "./Card";
import AddCategoryModal from "./AddCategoryModal";
import ChangeBankModal from "./ChangeBankModal";
import ConfirmActionModal from "./ConfirmActionModal";
import data from "../data.json";
import organizations from "../organizations";

const STORAGE_KEY = "cardsData";

function parsePercentToNumber(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const trimmed = value.trim();
    const withoutPercent = trimmed.endsWith("%")
      ? trimmed.slice(0, -1).trim()
      : trimmed;
    const normalized = withoutPercent.replace(",", ".");
    const n = Number(normalized);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

function normalizeCategory(category) {
  return {
    categoryId: category.categoryId,
    categoryName: category.categoryName,
    categoryPercent: parsePercentToNumber(
      category.categoryPercent ?? category.categoryProcent,
    ),
  };
}

function normalizeUserOrganization(userOrg) {
  return {
    ...userOrg,
    categories: Array.isArray(userOrg.categories)
      ? userOrg.categories.map(normalizeCategory)
      : [],
  };
}

function loadUserOrganizations() {
  const base = data.userOrganizations.map((userOrg) => {
    const org = organizations.find((org) => org.id === userOrg.organizationId);
    return {
      ...normalizeUserOrganization(userOrg),
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
    if (
      !parsed?.userOrganizations ||
      !Array.isArray(parsed.userOrganizations)
    ) {
      return base;
    }

    return parsed.userOrganizations.map((userOrg) => {
      const org = organizations.find((o) => o.id === userOrg.organizationId);
      return {
        ...normalizeUserOrganization(userOrg),
        logo: org?.logo,
      };
    });
  } catch {
    return base;
  }
}

function saveUserOrganizations(items) {
  if (typeof window === "undefined") return;
  const toSave = items.map((item) => {
    const { logo, ...rest } = item;
    void logo;
    return rest;
  });
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ userOrganizations: toSave }),
  );
}

export default function MainPage() {
  const [userOrganizations, setUserOrganizations] = useState(
    loadUserOrganizations,
  );

  const [isMoveMode, setIsMoveMode] = useState(false);
  const [editingCardId, setEditingCardId] = useState(null);
  const [categoryModal, setCategoryModal] = useState({
    open: false,
    mode: "add", // "add" | "edit"
    cardId: null,
    categoryId: null,
  });
  const [bankModal, setBankModal] = useState({
    open: false,
    cardId: null,
  });
  const [deleteConfirmModal, setDeleteConfirmModal] = useState({
    open: false,
    cardId: null,
  });
  const [clearConfirmModal, setClearConfirmModal] = useState({
    open: false,
    cardId: null,
  });
  const [deletingCardId, setDeletingCardId] = useState(null);
  const [lastAddedCardId, setLastAddedCardId] = useState(null);
  const justDraggedRef = useRef(false);

  function handleEditClick(cardId) {
    setEditingCardId(cardId);
  }

  function handlePlusClick(cardId) {
    setCategoryModal({
      open: true,
      mode: "add",
      cardId,
      categoryId: null,
    });
  }

  function handleCategoryClick(cardId, categoryId) {
    setCategoryModal({
      open: true,
      mode: "edit",
      cardId,
      categoryId,
    });
  }

  function handleBankClick(cardId) {
    setBankModal({
      open: true,
      cardId,
    });
  }

  function handleAddCategory(cardId, newCategory) {
    setUserOrganizations((prev) => {
      const items = prev.map((item) =>
        item.id === cardId
          ? {
              ...item,
              categories: [...item.categories, newCategory],
            }
          : item,
      );
      saveUserOrganizations(items);
      return items;
    });
  }

  function handleUpdateCategory(cardId, originalCategoryId, updatedCategory) {
    setUserOrganizations((prev) => {
      const items = prev.map((item) => {
        if (item.id !== cardId) return item;

        const duplicateExists = item.categories.some(
          (c) =>
            c.categoryId === updatedCategory.categoryId &&
            c.categoryId !== originalCategoryId,
        );
        if (duplicateExists) return item;

        const categories = item.categories.map((c) =>
          c.categoryId === originalCategoryId ? updatedCategory : c,
        );
        return { ...item, categories };
      });
      saveUserOrganizations(items);
      return items;
    });
  }

  function handleDeleteCategory(cardId, categoryId) {
    setUserOrganizations((prev) => {
      const items = prev.map((item) => {
        if (item.id !== cardId) return item;
        return {
          ...item,
          categories: item.categories.filter((c) => c.categoryId !== categoryId),
        };
      });
      saveUserOrganizations(items);
      return items;
    });
  }

  function handleCategoryWipeClick(cardId) {
    setUserOrganizations((prev) => {
      const items = prev.map((item) => {
        if (item.id !== cardId) return item;
        return { ...item, categories: [] };
      });
      saveUserOrganizations(items);
      return items;
    });
  }

  function handleModalClose() {
    setCategoryModal({
      open: false,
      mode: "add",
      cardId: null,
      categoryId: null,
    });
  }

  function handleBankModalClose() {
    setBankModal({
      open: false,
      cardId: null,
    });
  }

  function handleChangeBank(cardId, organizationId) {
    setUserOrganizations((prev) => {
      const items = prev.map((item) => {
        if (item.id !== cardId) return item;
        const org = organizations.find((o) => o.id === organizationId);
        return {
          ...item,
          organizationId: org?.id ?? item.organizationId,
          organizationName: org?.name ?? item.organizationName,
          logo: org?.logo,
        };
      });
      saveUserOrganizations(items);
      return items;
    });
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

  function requestDeleteCard(cardId) {
    setDeleteConfirmModal({ open: true, cardId });
  }

  function requestClearCategories(cardId) {
    setClearConfirmModal({ open: true, cardId });
  }

  function performDeleteCard(cardId) {
    setUserOrganizations((prev) => {
      const items = prev.filter((o) => o.id !== cardId);
      saveUserOrganizations(items);
      return items;
    });
    setDeletingCardId(null);
    if (editingCardId === cardId) setEditingCardId(null);
    if (categoryModal.cardId === cardId && categoryModal.open) {
      setCategoryModal({
        open: false,
        mode: "add",
        cardId: null,
        categoryId: null,
      });
    }
    if (bankModal.cardId === cardId && bankModal.open) {
      setBankModal({ open: false, cardId: null });
    }
  }

  function handleDeleteConfirm() {
    const cardId = deleteConfirmModal.cardId;
    if (cardId == null) return;
    setDeleteConfirmModal({ open: false, cardId: null });
    setDeletingCardId(cardId);
  }

  function handleDeleteAnimationEnd(cardId) {
    if (deletingCardId === cardId) {
      performDeleteCard(cardId);
    }
  }

  function handleDuplicateCard(cardId) {
    setUserOrganizations((prev) => {
      const idx = prev.findIndex((o) => o.id === cardId);
      if (idx === -1) return prev;
      const source = prev[idx];
      const maxId = Math.max(...prev.map((o) => o.id), 0);
      const newId = maxId + 1;
      const newCard = {
        ...source,
        id: newId,
        categories: source.categories.map((c) => ({ ...c })),
      };
      const items = [...prev];
      items.splice(idx + 1, 0, newCard);
      saveUserOrganizations(items);
      setLastAddedCardId(newId);
      return items;
    });
  }

  function handleCardAppearAnimationEnd() {
    setLastAddedCardId(null);
  }

  useEffect(() => {
    if (!isMoveMode && editingCardId === null) return;

    function handleClickOutside(event) {
      if (justDraggedRef.current) return;

      const onCard = event.target.closest("[data-card]");
      const onMenu = event.target.closest("[data-headlessui-state]");
      const onCategoryModal = event.target.closest("[data-add-category-modal]");
      const onBankModalEl = event.target.closest("[data-change-bank-modal]");
      const onConfirmModal = event.target.closest(
        "[data-confirm-action-modal]",
      );

      if (
        !onCard &&
        !onMenu &&
        !onCategoryModal &&
        !onBankModalEl &&
        !onConfirmModal
      ) {
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
                {userOrganizations.map((organization, index) => {
                  const isDeleting = deletingCardId === organization.id;
                  const isNew = lastAddedCardId === organization.id;
                  return (
                    <Draggable
                      key={organization.id}
                      draggableId={String(organization.id)}
                      index={index}
                      isDragDisabled={!isMoveMode || isDeleting}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          data-card
                          className={`focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 ${
                            isDeleting ? "animate-card-out" : ""
                          } ${isNew ? "animate-card-in" : ""}`}
                          onAnimationEnd={() => {
                            if (isDeleting) {
                              handleDeleteAnimationEnd(organization.id);
                            }
                            if (isNew) {
                              handleCardAppearAnimationEnd();
                            }
                          }}
                        >
                          <Card
                            logo={organization.logo}
                            organizationName={organization.organizationName}
                            categories={organization.categories}
                            isMoveMode={isMoveMode}
                            isEditMode={editingCardId !== null}
                            onEnterMoveMode={handleEnterMoveMode}
                            onEditClick={() => handleEditClick(organization.id)}
                            onPlusClick={() => handlePlusClick(organization.id)}
                            onCategoryClick={({ categoryId }) =>
                              handleCategoryClick(organization.id, categoryId)
                            }
                            onBankClick={() => handleBankClick(organization.id)}
                            onDuplicateClick={() =>
                              handleDuplicateCard(organization.id)
                            }
                            onDeleteClick={() =>
                              requestDeleteCard(organization.id)
                            }
                            onCategoryWipeClick={() =>
                              requestClearCategories(organization.id)
                            }
                          />
                        </div>
                      )}
                    </Draggable>
                  );
                })}
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
        key={`${categoryModal.mode}-${String(categoryModal.cardId)}-${String(
          categoryModal.categoryId,
        )}-${categoryModal.open ? "open" : "closed"}`}
        isOpen={categoryModal.open}
        onClose={handleModalClose}
        mode={categoryModal.mode}
        onSubmit={(category) => {
          if (!categoryModal.cardId) return;
          if (categoryModal.mode === "add") {
            handleAddCategory(categoryModal.cardId, category);
            return;
          }
          if (!categoryModal.categoryId) return;
          handleUpdateCategory(
            categoryModal.cardId,
            categoryModal.categoryId,
            category,
          );
        }}
        onDelete={() => {
          if (categoryModal.mode !== "edit") return;
          if (!categoryModal.cardId || !categoryModal.categoryId) return;
          handleDeleteCategory(categoryModal.cardId, categoryModal.categoryId);
        }}
        organizationName={
          userOrganizations.find((o) => o.id === categoryModal.cardId)
            ?.organizationName ?? ""
        }
        existingCategoryIds={
          userOrganizations
            .find((o) => o.id === categoryModal.cardId)
            ?.categories?.map((c) => c.categoryId) ?? []
        }
        initialCategoryId={
          categoryModal.mode === "edit" ? categoryModal.categoryId : null
        }
        initialPercent={
          categoryModal.mode === "edit"
            ? userOrganizations
                .find((o) => o.id === categoryModal.cardId)
                ?.categories?.find((c) => c.categoryId === categoryModal.categoryId)
                ?.categoryPercent ?? null
            : null
        }
      />

      <ChangeBankModal
        isOpen={bankModal.open}
        onClose={handleBankModalClose}
        onSubmit={(organizationId) => {
          if (!bankModal.cardId) return;
          handleChangeBank(bankModal.cardId, organizationId);
        }}
        currentOrganizationId={
          userOrganizations.find((o) => o.id === bankModal.cardId)
            ?.organizationId ?? null
        }
      />

      <ConfirmActionModal
        isOpen={deleteConfirmModal.open}
        onClose={() =>
          setDeleteConfirmModal({ open: false, cardId: null })
        }
        onConfirm={handleDeleteConfirm}
        title="Удалить карточку?"
        description="Вы действительно хотите удалить эту карточку? Это действие нельзя отменить."
        confirmLabel="Удалить"
      />

      <ConfirmActionModal
        isOpen={clearConfirmModal.open}
        onClose={() =>
          setClearConfirmModal({ open: false, cardId: null })
        }
        onConfirm={() => {
          if (clearConfirmModal.cardId != null) {
            handleCategoryWipeClick(clearConfirmModal.cardId);
          }
        }}
        title="Очистить категории?"
        description="Вы действительно хотите удалить все категории у этой карточки? Это действие нельзя отменить."
        confirmLabel="Очистить"
      />
    </div>
  );
}
