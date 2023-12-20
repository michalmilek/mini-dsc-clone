import { useCallback, useState } from 'react';

type Status = "idle" | "loading" | "success" | "error";

const useAsync = <T, U extends any[]>(
  asyncFunction: (...args: U) => Promise<T>
) => {
  const [status, setStatus] = useState<Status>("idle");
  const [value, setValue] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    (...args: U) => {
      setStatus("loading");
      setValue(null);
      setError(null);

      asyncFunction(...args)
        .then((response) => {
          setValue(response);
          setStatus("success");
        })
        .catch((error) => {
          setError(error as Error);
          setStatus("error");
        });
    },
    [asyncFunction]
  );

  return { execute, status, value, error };
};

export default useAsync;
