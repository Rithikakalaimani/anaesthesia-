import { redirect } from "next/navigation";

export default async function PatientViewPage({
  params,
}: {
  params: Promise<{ patientId: string }>;
}) {
  const { patientId } = await params;
  redirect(`/dashboard/patients/${patientId}/pre-anesthetic`);
}
