import { useLocalSearchParams } from "expo-router";

import { PatientRecordScreen } from "@/features/patient/record/patient-record";

export default function PatientRecordRoute() {
  const { id, created } = useLocalSearchParams<{
    id: string;
    created?: string;
  }>();

  return <PatientRecordScreen id={id} created={created === "1"} />;
}
