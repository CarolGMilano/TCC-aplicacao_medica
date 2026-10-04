import { getToken } from "@/features/auth/auth-session";
import { API_BASE_URL } from "@/features/auth/services/auth-api";

import { toPatientRegistration } from "../../registration/services/patient-registration-api";
import type { PatientForm } from "../../registration/types";
import type { DataTab, PatientRecord } from "../types";

const historyPaths = {
  obstetric: "/api/historico/gineco-obstetrico",
  sexual: "/api/historico/saude-sexual",
  habits: "/api/historico/tabagismo",
  ist: "/api/historico/ist",
};

async function send(method: string, path: string, body?: object) {
  const token = getToken();

  if (!token) {
    throw new Error("Sua sessão expirou. Faça login novamente.");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (response.ok) return;

  if (response.status === 401 || response.status === 403) {
    throw new Error("Sua sessão expirou. Faça login novamente.");
  }

  if (response.status === 409) {
    throw new Error("Já existe uma paciente com este prontuário.");
  }

  throw new Error("Não foi possível salvar as alterações.");
}

// Com id, atualiza o registro existente; sem id, cria o primeiro.
function saveHistory(path: string, id: number | undefined, body: object) {
  return id ? send("PUT", `${path}/${id}`, body) : send("POST", path, body);
}

// As ISTs são uma lista: o que foi desmarcado é removido, o que foi
// marcado é criado e o HPV é atualizado se o condiloma mudou.
async function saveIsts(
  record: PatientRecord,
  next: { ist: string; condilomaHpv: boolean }[],
) {
  const idPaciente = record.id;
  const current = record.ids.ists;

  for (const item of current) {
    if (!next.some((ist) => ist.ist === item.ist)) {
      await send("DELETE", `${historyPaths.ist}/${item.idHistorico}`);
    }
  }

  for (const item of next) {
    const existing = current.find((ist) => ist.ist === item.ist);

    if (!existing) {
      await send("POST", historyPaths.ist, { idPaciente, ...item });
    } else if (Boolean(existing.condilomaHpv) !== item.condilomaHpv) {
      await send("PUT", `${historyPaths.ist}/${existing.idHistorico}`, {
        idPaciente,
        ...item,
      });
    }
  }
}

// Salva só a aba editada, montando o corpo com o mesmo mapeamento do cadastro.
export function saveTab(
  record: PatientRecord,
  tab: DataTab,
  form: PatientForm,
) {
  const payload = toPatientRegistration(form);
  const idPaciente = record.id;

  switch (tab) {
    case "personal":
      return send("PUT", `/api/pacientes/${idPaciente}`, payload.paciente);
    case "obstetric":
      return saveHistory(historyPaths.obstetric, record.ids.obstetric, {
        idPaciente,
        ...payload.dadosGinecoObstetricos,
      });
    case "sexual":
      return saveHistory(historyPaths.sexual, record.ids.sexual, {
        idPaciente,
        ...payload.saudeSexual,
      });
    case "habits":
      return saveHistory(historyPaths.habits, record.ids.habits, {
        idPaciente,
        ...payload.historicoTabagismo,
      });
    case "ist":
      return saveIsts(record, payload.historicoIst);
  }
}
