"use client";

import { useState, useCallback } from "react";

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (url, method = "GET", body = null) => {
    setLoading(true);
    setError(null);

    try {
      const options = {
        method,
        headers: { "Content-Type": "application/json" },
      };

      if (body) options.body = JSON.stringify(body);

      const res = await fetch(url, options);
      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        return { data: null, success: false, error: data.message };
      }

      return { data, success: true, error: null };
    } catch (err) {
      setError(err.message);
      return { data: null, success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const get = useCallback((url) => request(url, "GET"), [request]);
  const post = useCallback(
    (url, body) => request(url, "POST", body),
    [request]
  );

  return { get, post, loading, error };
};
