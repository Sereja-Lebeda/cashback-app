import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { initDataUser } from "@telegram-apps/sdk";

function getTimeParts() {
  const d = new Date();
  return {
    hours: String(d.getHours()).padStart(2, "0"),
    minutes: String(d.getMinutes()).padStart(2, "0"),
    seconds: String(d.getSeconds()).padStart(2, "0"),
  };
}

function TimePart({ value }) {
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="inline-block"
    >
      {value}
    </motion.span>
  );
}

function getDisplayName() {
  try {
    const user = initDataUser?.();
    return user?.username || user?.first_name || "Миллионер";
  } catch {
    return "Миллионер";
  }
}

export default function Header({ onAddCardClick = () => {} }) {
  const [timeParts, setTimeParts] = useState(getTimeParts);
  const displayName = getDisplayName();

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeParts(getTimeParts());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="grid grid-cols-[auto_1fr_auto] grid-rows-2 w-full text-text-primary gap-x-4 gap-y-1 items-center px-2">
      {/* col-1 row-1/2: логотип */}
      <div className="col-start-1 row-span-2 flex items-center">
        <img
          src="/pics/AppLogoCropped.png"
          alt="logo"
          className="w-12 h-12 object-contain object-center rounded"
        />
      </div>

      {/* col-2 row-1: Привет, Пупа-Лупа — самая широкая колонка */}
      <div className="col-start-2 row-start-1 flex items-end justify-center text-xl">
        <span>Привет, {displayName}</span>
      </div>

      {/* col-2 row-2: Time */}
      <div className="col-start-2 row-start-2 flex items-start justify-center text-base text-text-secondary">
        <span>
          <TimePart value={timeParts.hours} />:
          <TimePart value={timeParts.minutes} />:
          <TimePart value={timeParts.seconds} />
        </span>
      </div>

      {/* col-3 row-1: add / row-2: card — текстовая кнопка с Motion */}
      <div className="col-start-3 row-span-2 flex items-center justify-end border-none outline-none">
        <motion.button
          type="button"
          onClick={onAddCardClick}
          className="group relative flex flex-col items-end rounded py-0.5 focus:outline-none overflow-visible"
          aria-label="Добавить карточку"
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <motion.span className="relative inline-block">
            <motion.span
              className="text-accent font-medium block"
              animate={{ opacity: [1, 0.85, 1] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                repeatType: "loop",
              }}
            >
              ADD
            </motion.span>
            <motion.span
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
              animate={{ scaleX: [0, 1, 0] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut",
              }}
              style={{ transformOrigin: "right" }}
            />
          </motion.span>
          <span className="text-text-secondary text-sm -mt-0.5 block">
            CARD
          </span>
        </motion.button>
      </div>
    </div>
  );
}
