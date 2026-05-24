const MIMO_API_URL = "https://api.xiaomimimo.com/v1/chat/completions";
const MIMO_MODEL = "mimo-v2.5-pro";

type InlineData = { inlineData: { data: string; mimeType: string } };
type ContentPart = string | InlineData;

async function callMimo(messages: object[], jsonMode: boolean): Promise<string> {
  const body: Record<string, unknown> = {
    model: MIMO_MODEL,
    messages,
  };
  if (jsonMode) {
    body.response_format = { type: "json_object" };
  }

  const res = await fetch(MIMO_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": process.env.MIMO_API_KEY!,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`MiMo API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.choices[0].message.content as string;
}

class MimoModel {
  constructor(private jsonMode: boolean) {}

  async generateContent(input: string | ContentPart[]): Promise<{ response: { text: () => string } }> {
    let messages: object[];

    if (typeof input === "string") {
      messages = [{ role: "user", content: input }];
    } else {
      const content = input.map((part) => {
        if (typeof part === "string") {
          return { type: "text", text: part };
        }
        return {
          type: "image_url",
          image_url: {
            url: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`,
          },
        };
      });
      messages = [{ role: "user", content }];
    }

    const text = await callMimo(messages, this.jsonMode);
    return { response: { text: () => text } };
  }
}

export function getModel(jsonMode = true) {
  return new MimoModel(jsonMode);
}
