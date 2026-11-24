// "Swipe to confirm" control. Drag the handle all the way right (or use the arrow keys / End) to confirm.
import { useRef, useState } from "react";

const DONE_AT = 0.92; // fraction of the track that counts as a full swipe

export default function SwipeToConfirm({ label = "Swipe to confirm", busyLabel = "Confirming…", onConfirm, disabled = false }) {
  const trackRef = useRef(null);
  const drag = useRef(null);
  const [progress, setProgress] = useState(0); // 0..1
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);

  const maxTravel = () => {
    const track = trackRef.current;
    if (!track) return 1;
    const knob = track.querySelector(".mb-swipe-knob");
    return Math.max(1, track.clientWidth - (knob?.offsetWidth || 48) - 8);
  };

  const finish = async () => {
    setProgress(1);
    setBusy(true);
    try {
      await onConfirm();
    } finally {
      setBusy(false);
      setProgress(0);
    }
  };

  const onPointerDown = (e) => {
    if (disabled || busy) return;
    drag.current = { startX: e.clientX, travel: maxTravel() };
    setDragging(true);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!drag.current) return;
    const p = Math.min(1, Math.max(0, (e.clientX - drag.current.startX) / drag.current.travel));
    setProgress(p);
  };
  const onPointerUp = () => {
    if (!drag.current) return;
    drag.current = null;
    setDragging(false);
    if (progress >= DONE_AT) finish();
    else setProgress(0); // spring back
  };

  const onKeyDown = (e) => {
    if (disabled || busy) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      const next = Math.min(1, progress + 0.25);
      setProgress(next);
      if (next >= 1) finish();
    } else if (e.key === "End") {
      e.preventDefault();
      finish();
    } else if (e.key === "ArrowLeft" || e.key === "Home" || e.key === "Escape") {
      setProgress(0);
    }
  };

  const px = `calc(${progress} * (100% - 56px))`;

  return (
    <div
      ref={trackRef}
      className={`mb-swipe${disabled ? " is-disabled" : ""}${busy ? " is-busy" : ""}`}
      style={{ "--swipe-fill": `${Math.round(progress * 100)}%` }}
    >
      <span className="mb-swipe-fill" aria-hidden="true" />
      <span className="mb-swipe-label" aria-hidden="true">{busy ? busyLabel : label}</span>
      <span
        className="mb-swipe-knob"
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-label={`${label}. Drag right, or press End, to confirm.`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
        aria-disabled={disabled || busy}
        style={{ transform: `translateX(${px})`, transition: dragging ? "none" : undefined }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={onKeyDown}
      >
        <i className={`bi ${busy ? "bi-hourglass-split" : "bi-chevron-double-right"}`} />
      </span>
    </div>
  );
}
