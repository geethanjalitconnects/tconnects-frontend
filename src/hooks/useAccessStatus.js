/**
 * useAccessStatus.js
 * ------------------
 * Fetches the current user's subscription + feature access from the backend.
 * Returns { status, loading, refresh }
 *
 * status shape:
 * {
 *   subscription: { plan, expiry_date, is_currently_active, can_use_resume, can_use_mock_interview } | null,
 *   feature_access: { resume_purchased, resume_used, mock_interview_purchased_count, ... } | null,
 *   access: {
 *     resume:          { allowed: bool, reason: string },
 *     mock_interview:  { allowed: bool, reason: string },
 *   }
 * }
 */

import { useState, useEffect, useCallback } from "react";
import api from "../config/api";

export default function useAccessStatus(user) {
  const [status, setStatus]   = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) {
      setStatus(null);
      setLoading(false);
      return;
    }
    try {
      const res = await api.get("/api/payments/access-status/");
      setStatus(res.data);
    } catch {
      setStatus(null);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    setLoading(true);
    refresh();
  }, [refresh]);

  return { status, loading, refresh };
}
