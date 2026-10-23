import { getToken } from "@/features/auth/auth-session";
import { apiFetch } from "@/features/auth/services/auth-api";

import { readRuleMessage } from "../../attendance/attendance-api";
import { toPatientRegistration } from "../../registration/services/patient-registration-api";
import type { PatientForm } from "../../registration/types";
import type { DataTab, PatientDetail, PatientRecord } from "../types";
import {
  USE_MOCK_PATIENT_RECORD,
  updateMockPatientStatus,
} from "./patient-record-api";

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

  const response = await apiFetch(path, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (response.ok) return response;

  if (response.status === 401 || response.status === 403) {
    throw new Error("Sua sessão expirou. Faça login novamente.");
  }

  if (response.status === 409) {
    throw new Error("Já existe uma paciente com este prontuário.");
  }

  throw new Error(
    (await readRuleMessage(response)) ?? "Não foi possível salvar as alterações.",
  );
}

// Com id, atualiza o registro existente; sem id, cria o primeiro.
function saveHistory(path: string, id: number | undefined, body: object) {
  return id ? send("PUT", `${path}/${id}`, body) : send("POST", path, body);
}

// As ISTs são uma lista: o que foi marcado é criado, o HPV é atualizado se o
// condiloma mudou e o que foi desmarcado é removido por último, para uma
// falha no meio não deixar a paciente sem IST. A lista atual vem do backend,
// para uma nova tentativa não criar de novo o que já foi gravado.
async function saveIsts(
  idPaciente: number,
  next: { ist: string; condilomaHpv: boolean }[],
) {
  const response = await send(
    "GET",
    `${historyPaths.ist}/paciente/${idPaciente}`,
  );
  const current = (await response.json()) as PatientDetail["historicoIst"];

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

  for (const item of current) {
    if (!next.some((ist) => ist.ist === item.ist)) {
      await send("DELETE", `${historyPaths.ist}/${item.idHistorico}`);
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
      if (USE_MOCK_PATIENT_RECORD) {
        updateMockPatientStatus(idPaciente, form.status);
        return Promise.resolve();
      }
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
      return saveIsts(idPaciente, payload.historicoIst);
  }
}
