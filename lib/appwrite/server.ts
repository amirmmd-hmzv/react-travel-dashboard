import { appwriteConfig } from "./client";

function serverUrl(path: string) {
  return `${appwriteConfig.endpointUrl}${path}`;
}

function defaultHeaders(request: Request) {
  const cookie = request.headers.get("Cookie") || "";
  return {
    Cookie: cookie,
    "X-Appwrite-Project": appwriteConfig.projectId,
    "Content-Type": "application/json",
    "X-Appwrite-Response-Format": "1.8.0",
  };
}

async function handleResponse(res: Response) {
  if (!res.ok) {
    const text = await res.text();
    let message: string;
    try {
      const json = JSON.parse(text);
      message = json.message || text;
    } catch {
      message = text;
    }
    throw new Error(message);
  }
  return res.json();
}

export async function getServerUser(request: Request) {
  const res = await fetch(serverUrl("/account"), {
    headers: defaultHeaders(request),
  });
  return handleResponse(res);
}

export async function createServerDocument(
  request: Request,
  collectionId: string,
  data: Record<string, unknown>,
  permissions?: { read?: string[]; write?: string[] },
) {
  const body: Record<string, unknown> = {
    documentId: "unique()",
    data,
  };
  if (permissions?.read) body["permissions"] = permissions.read;
  if (permissions?.write) body["permissions"] = permissions.write;

  const res = await fetch(
    serverUrl(
      `/databases/${appwriteConfig.databaseId}/collections/${collectionId}/documents`,
    ),
    {
      method: "POST",
      headers: defaultHeaders(request),
      body: JSON.stringify(body),
    },
  );
  return handleResponse(res);
}

export async function listServerDocuments(
  request: Request,
  collectionId: string,
  queries: string[] = [],
) {
  const url = new URL(
    serverUrl(
      `/databases/${appwriteConfig.databaseId}/collections/${collectionId}/documents`,
    ),
  );
  for (const q of queries) {
    url.searchParams.append("queries[]", q);
  }
  const res = await fetch(url.toString(), {
    headers: defaultHeaders(request),
  });
  return handleResponse(res);
}
