import type { VercelRequest, VercelResponse } from "@vercel/node";
import { list, put } from "@vercel/blob";

type Signature = {
  id: string;
  name: string;
  email?: string;
  message?: string;
  date: string;
};

const BLOB_PATH = "signatures/signatures.json";
const MAX_SIGNATURES_STORED = 100;

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const parseBody = async (req: VercelRequest) => {
  if (req.body) {
    return req.body;
  }

  const chunks: Uint8Array[] = [];

  for await (const chunk of req) {
    if (typeof chunk === "string") {
      chunks.push(Buffer.from(chunk));
    } else {
      chunks.push(chunk);
    }
  }

  if (!chunks.length) return null;

  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf-8"));
  } catch (error) {
    return null;
  }
};

const loadSignatures = async (): Promise<Signature[]> => {
  try {
    const { blobs } = await list({ prefix: BLOB_PATH });
    const existing = blobs.find((blob) => blob.pathname === BLOB_PATH);

    if (!existing) return [];

    const url = (existing as { downloadUrl?: string; url?: string }).downloadUrl ?? existing.url;

    if (!url) return [];

    const response = await fetch(url);
    if (!response.ok) return [];

    const data = await response.json().catch(() => []);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Failed to load signatures blob", error);
    return [];
  }
};

const saveSignatures = async (signatures: Signature[]) => {
  await put(BLOB_PATH, JSON.stringify(signatures), {
    access: "public",
    addRandomSuffix: false,
    contentType: "application/json",
    cacheControlMaxAge: 0,
  });
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "GET") {
    try {
      const signatures = await loadSignatures();
      return res.status(200).json({ signatures });
    } catch (error) {
      console.error("Failed to load signatures", error);
      return res.status(500).json({ error: "Unable to load signatures right now." });
    }
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  const body = (await parseBody(req)) ?? {};
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : undefined;
  const message = typeof body.message === "string" ? body.message.trim() : undefined;

  if (!name) {
    return res.status(400).json({ error: "Name is required." });
  }

  if (email && !isValidEmail(email)) {
    return res.status(400).json({ error: "Please provide a valid email." });
  }

  if (message && message.length > 200) {
    return res.status(400).json({ error: "Message can be at most 200 characters long." });
  }

  const signature: Signature = {
    id: crypto.randomUUID(),
    name,
    email,
    message,
    date: new Date().toISOString(),
  };

  try {
    const existing = await loadSignatures();
    const updated = [signature, ...existing].slice(0, MAX_SIGNATURES_STORED);

    await saveSignatures(updated);

    return res.status(201).json({ signature });
  } catch (error) {
    console.error("Failed to save signature", error);
    return res.status(500).json({ error: "Unable to save your signature right now. Please try again." });
  }
}
