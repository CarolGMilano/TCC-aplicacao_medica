import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";

// Busca dados ao focar a tela (voltar da ficha ou de outra aba recarrega) e
// de novo sempre que "key" muda (ex.: o prazo escolhido num filtro).
export function useRequest<T>(load: () => Promise<T>, key = "") {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const loadRef = useRef(load);
  const keyRef = useRef(key);

  useEffect(() => {
    loadRef.current = load;
  });

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setError("");
      // Ao trocar a chave, some com os dados antigos e mostra o carregando.
      if (key !== keyRef.current) setData(null);
      keyRef.current = key;
      loadRef
        .current()
        .then((result) => {
          if (active) setData(result);
        })
        .catch((requestError: unknown) => {
          if (!active) return;
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Não foi possível carregar os dados.",
          );
        })
        .finally(() => {
          if (active) setIsLoading(false);
        });
      return () => {
        active = false;
      };
    }, [key]),
  );

  return { data, error, isLoading: isLoading && data === null };
}
