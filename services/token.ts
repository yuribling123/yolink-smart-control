let ACCESS_TOKEN: string | null = null;

const API = "https://api.yosmart.com/open/yolink/token";

// fetch a new token
export async function getToken(): Promise<string> {
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "client_credentials",
      client_id:  process.env.YOLINK_CLIENT_ID,
      client_secret: process.env.YOLINK_SECRET_KEY!,
    }),
  });
  const data = await res.json();
  ACCESS_TOKEN = data.access_token;
  return ACCESS_TOKEN!;
}

// ensure we have a token
export async function ensureToken(): Promise<string> {
  if (!ACCESS_TOKEN) {
    return getToken();
  }
  return ACCESS_TOKEN;
}
