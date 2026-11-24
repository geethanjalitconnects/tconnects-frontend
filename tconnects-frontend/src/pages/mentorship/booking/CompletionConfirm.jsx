// Two-sided "session completed" confirmation: shows who has confirmed and lets this side swipe to confirm.
import SwipeToConfirm from "./SwipeToConfirm";
import { fmtDateTime } from "./bookingUtils";

/**
 * booking   booking object with `status` and `completion`
 * role      "mentor" | "booker"  (whose dashboard this is)
 * onConfirm async () => void
 */
export default function CompletionConfirm({ booking, role, onConfirm }) {
  const c = booking?.completion;
  if (!c) return null;
  const completed = booking.status === "completed";
  const started = c.can_confirm || c.you_confirmed || c.other_confirmed || completed;
  if (!started || !["confirmed", "completed"].includes(booking.status)) return null;

  const isMentor = role === "mentor";
  const mentorDone = Boolean(c.mentor_confirmed_at);
  const menteeDone = Boolean(c.booker_confirmed_at);

  let title;
  let text;
  if (completed) {
    title = "Session completed";
    text = isMentor
      ? "You and your mentee both confirmed this session. Your payout is ready to be released."
      : "You and your mentor both confirmed this session.";
  } else if (c.you_confirmed) {
    title = isMentor ? "Waiting for your mentee" : "Waiting for your mentor";
    text = isMentor
      ? "You've confirmed. The session completes, and your payout is released for payment, once your mentee confirms too."
      : "You've confirmed. The session completes once your mentor confirms too.";
  } else {
    title = "Did this session take place?";
    text = isMentor
      ? "Swipe to confirm the session is completed. Your payout stays on hold until both you and your mentee confirm."
      : "If your session took place, swipe to confirm it's completed. If something went wrong, report a problem instead.";
  }

  return (
    <div className="mb-confirm-box">
      <b><i className={`bi ${completed ? "bi-patch-check-fill" : "bi-check2-square"}`} /> {title}</b>
      <p>{text}</p>
      <div className="mb-confirm-steps">
        <div className={mentorDone ? "done" : "wait"}>
          <i className={`bi ${mentorDone ? "bi-check-circle-fill" : "bi-circle"}`} />
          <span>{isMentor ? "You (mentor)" : "Mentor"}<small>{mentorDone ? fmtDateTime(c.mentor_confirmed_at) : "Not confirmed yet"}</small></span>
        </div>
        <div className={menteeDone ? "done" : "wait"}>
          <i className={`bi ${menteeDone ? "bi-check-circle-fill" : "bi-circle"}`} />
          <span>{isMentor ? "Mentee" : "You (mentee)"}<small>{menteeDone ? fmtDateTime(c.booker_confirmed_at) : "Not confirmed yet"}</small></span>
        </div>
      </div>
      {c.can_confirm && !completed && (
        <SwipeToConfirm label="Swipe to confirm session completed" onConfirm={onConfirm} />
      )}
    </div>
  );
}
