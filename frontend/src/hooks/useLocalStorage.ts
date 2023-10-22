import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string) {
  let initialValue = {
    data: {},
    token : ""
  };
  const [value, setValue] = useState<T>(() => {
    if (typeof window !== "undefined") {
      const jsonValue = localStorage.getItem(key);
      if (jsonValue != null) {
        return JSON.parse(jsonValue);
      }
      if (typeof initialValue === "function") {
        return initialValue as () => T;
      } else {
        return initialValue;
      }
    }
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as [typeof value, typeof setValue];
}
