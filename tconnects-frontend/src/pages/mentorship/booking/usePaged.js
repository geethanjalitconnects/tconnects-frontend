import { useCallback, useEffect, useState } from "react";
import { apiError } from "../../../services/mentorshipApi";

/**
 * Load one page of a paginated DRF endpoint. `fetcher(params)` returns the response body
 * ({ results, count, total_pages, ...extra } or a plain array). Re-runs when `key` changes.
 */
export default function usePaged(fetcher, params, key) {
  const [page, setPage] = useState(1);
  const [state, setState] = useState({ rows: [], count: 0, totalPages: 1, extra: {}, loading: true, error: "", errorStatus: null });
  const [reloadKey, setReloadKey] = useState(0);

  // Back to page 1 whenever the filters change.
  useEffect(() => setPage(1), [key]);

  useEffect(() => {
    let active = true;
    setState((s) => ({ ...s, loading: true, error: "", errorStatus: null }));
    fetcher({ ...params, page })
      .then((data) => {
        if (!active) return;
        const rows = Array.isArray(data) ? data : data?.results || [];
        const { results: _r, ...extra } = Array.isArray(data) ? {} : data || {};
        setState({
          rows,
          count: Array.isArray(data) ? rows.length : Number(data?.count ?? rows.length),
          totalPages: Math.max(1, Number(data?.total_pages) || (data?.next ? page + 1 : page)),
          extra,
          loading: false,
          error: "",
          errorStatus: null,
        });
      })
      .catch((err) => {
        if (!active) return;
        setState((s) => ({ ...s, rows: [], loading: false, error: apiError(err), errorStatus: err?.response?.status || null }));
      });
    return () => {
      active = false;
    };
    // `key` stands for the filters in `params`; the fetcher is an inline function.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, key, reloadKey]);

  const reload = useCallback(() => setReloadKey((k) => k + 1), []);
  return { ...state, page, setPage, reload };
}
