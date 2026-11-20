import coherePkg from "cohere-ai";
const { CohereClient } = coherePkg;

const client = new CohereClient({ token: "h....uj" }); // use token here

async function test() {
  try {
    const response = await client.chat({
      model: "command-xlarge-nightly",
      messages: [
        { role: "user", content: "Analyze this text and return JSON: Hello world." }
      ],
      max_output_tokens: 300,
    });

    const content = response?.choices?.[0]?.message?.content;
    const text = Array.isArray(content)
      ? content.map(c => c.text).join(" ")
      : (content || "");

    console.log("✅ Parsed output:", text || "No output received");
  } catch (err) {
    console.error("❌ Unexpected error:", err);
  }
}

test();
