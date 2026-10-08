import { useCallback, useMemo, useState } from "react";
import { useFocusEffect } from "expo-router";

import { fetchPatients } from "./services/patient-list-api";
import type { PatientListItem } from "./types";

export function usePatientList(status: string, search: string) {
  const [patients, setPatients] = useState<PatientListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const loadPatients = useCallback(() => {
    let active = true;

    setIsLoading(true);
    setError("");

    fetchPatients(search, status)
      .then((result) => {
        if (!active) return;
        setPatients(result.patients);
        setTotal(result.total);
      })
      .catch((requestError: unknown) => {
        if (!active) return;
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Não foi possível carregar as pacientes.",
        );
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [search, status]);

  useFocusEffect(loadPatients);

  const filteredPatients = useMemo(() => {
    const normalizedSearch = search
      .trim()
      .toLocaleLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    return patients.filter((patient) => {
      const matchesStatus = status === "Todas" || patient.status === status;
      const searchableText = `${patient.name} ${patient.record}`
        .toLocaleLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      return matchesStatus && searchableText.includes(normalizedSearch);
    });
  }, [patients, search, status]);

  return { patients, filteredPatients, total, error, isLoading };
}
