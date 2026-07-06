import { put, del, head } from "@vercel/blob";

function assertConfigured(): void {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error(
      "BLOB_READ_WRITE_TOKEN is not set. Vercel Blob storage needs to be created and connected to this project — see the deployment guide for the 2-click setup in Vercel's Storage tab."
    );
  }
}

// Stores job application CVs and a searchable index of submissions in
// Vercel Blob storage — deliberately separate from GitHub (which holds site
// content) since applicant data is personal information (POPIA-relevant)
// that shouldn't live in permanent git history, and separate from Vercel's
// env vars (which hold secrets, not files).
//
// Security note: Vercel Blob's `put()` here uses `access: "public"` with a
// random suffix on the pathname, which is Vercel Blob's standard mode on
// most plans. This means the CV is not protected by real access control if
// someone obtains the exact (long, random) URL — but that URL is never
// shown anywhere in the public site or admin UI; admin downloads proxy
// through an authenticated API route instead of exposing the raw URL. If
// your Vercel plan supports private/authenticated Blob access, that would
// be a stronger guarantee — worth checking as a future hardening step.

export type ApplicationRecord = {
  id: string;
  name: string;
  email: string;
  phone: string;
  jobSlug: string;
  jobTitle: string;
  submittedAt: string;
  cvBlobUrl: string;
  cvFileName: string;
};

const INDEX_PATH = "applications/index.json";

async function getIndex(): Promise<ApplicationRecord[]> {
  assertConfigured();
  const meta = await head(INDEX_PATH).catch((err) => {
    // A 404 here just means "no submissions yet" — anything else (auth,
    // network) should surface, not be silently treated as empty.
    if (err?.status === 404 || /not found/i.test(err?.message ?? "")) return null;
    throw err;
  });
  if (!meta) return [];
  const res = await fetch(meta.url, { cache: "no-store" });
  if (!res.ok) return [];
  return (await res.json()) as ApplicationRecord[];
}

async function saveIndex(records: ApplicationRecord[]): Promise<void> {
  await put(INDEX_PATH, JSON.stringify(records, null, 2), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

export async function listApplications(): Promise<ApplicationRecord[]> {
  const records = await getIndex();
  return records.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
}

export async function addApplication(
  input: Omit<ApplicationRecord, "id" | "submittedAt" | "cvBlobUrl"> & { cvBase64: string; cvFileName: string }
): Promise<ApplicationRecord> {
  assertConfigured();
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const safeName = input.cvFileName.toLowerCase().replace(/[^a-z0-9.\-_]/g, "-");
  const cvPath = `applications/cvs/${id}-${safeName}`;

  const buffer = Buffer.from(input.cvBase64, "base64");
  const blob = await put(cvPath, buffer, {
    access: "public",
    addRandomSuffix: true,
    contentType: "application/pdf",
  });

  const record: ApplicationRecord = {
    id,
    name: input.name,
    email: input.email,
    phone: input.phone,
    jobSlug: input.jobSlug,
    jobTitle: input.jobTitle,
    submittedAt: new Date().toISOString(),
    cvBlobUrl: blob.url,
    cvFileName: input.cvFileName,
  };

  const records = await getIndex();
  records.push(record);
  await saveIndex(records);

  return record;
}

export async function deleteApplication(id: string): Promise<void> {
  const records = await getIndex();
  const record = records.find((r) => r.id === id);
  if (record) {
    await del(record.cvBlobUrl).catch(() => {
      // If the blob is already gone, don't block removing the index entry
    });
  }
  await saveIndex(records.filter((r) => r.id !== id));
}
