import { useRef, useEffect } from "react";

export function ResetDayInput({
  inputValue,
  onInputChange,
  dayValue,
  onDayChange,
  onSwitchToLast,
  className,
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    const handler = (e) => e.preventDefault();
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, []);

  function handleChange(e) {
    const raw = e.target.value;
    onInputChange(raw);
    if (raw !== "") {
      const n = parseInt(raw, 10);
      if (Number.isFinite(n)) {
        if (n > 31) {
          onSwitchToLast();
        } else if (n >= 1 && n <= 31) {
          onDayChange(n);
        }
      }
    }
  }

  function handleBlur(e) {
    const raw = e.target.value;
    const n = parseInt(raw, 10);
    if (raw === "" || !Number.isFinite(n) || n < 1) {
      onInputChange(String(dayValue));
    } else if (n > 31) {
      onSwitchToLast();
    } else {
      onInputChange(String(n));
      onDayChange(n);
    }
  }

  return (
    <input
      ref={inputRef}
      type="number"
      min={1}
      max={31}
      value={inputValue}
      onChange={handleChange}
      onBlur={handleBlur}
      className={className}
    />
  );
}
