import { useState } from "react";
import { SERVICES } from "../data/services";

export function useSearchSuggestions() {
  const [query, setQuery] = useState("");
  const [show, setShow] = useState(false);

  const results = SERVICES.filter((s) =>
    s.toLowerCase().includes(query.toLowerCase()),
  );

  return {
    query,
    setQuery,
    show,
    setShow,
    results,
  };
}
