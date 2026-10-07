import { useEffect, useMemo, useState } from "react";

import { fetchPatients } from "./services/patient-list-api";
import type { PatientListItem } from "./types";

export function usePatientList(status: string, search: string) {
  const [patients, setPatients] = useState<PatientListItem[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    fetchPatients(search, status)
      .then((result) => {
        if (active) setPatients(result);
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

  return { patients, filteredPatients, error, isLoading };
}
