export async function handler(event, context) {
  const API_KEY = process.env.VOICERSS_KEY; // make sure this env var is set in Netlify
  const text = event.queryStringParameters.text;

  if (!text) {
    return {
      statusCode: 400,
      body: "Missing 'text' query parameter",
    };
  }

  try {
    const url = `https://api.voicerss.org/?key=${API_KEY}&hl=fr-fr&src=${encodeURIComponent(
      text
    )}&c=MP3&f=44khz_16bit_stereo`;

    const response = await fetch(url);
    const contentType = response.headers.get("content-type");

    // If VoiceRSS returns text instead of audio, it's an error
    if (!contentType.includes("audio/mpeg")) {
      const errorText = await response.text();
      console.error("VoiceRSS error:", errorText);
      return {
        statusCode: 500,
        body: `VoiceRSS error: ${errorText}`,
      };
    }

    const arrayBuffer = await response.arrayBuffer();

    return {
      statusCode: 200,
      headers: { "Content-Type": "audio/mpeg" },
      body: Buffer.from(arrayBuffer).toString("base64"),
      isBase64Encoded: true,
    };
  } catch (err) {
    console.error("Serverless TTS fetch error:", err);
    return {
      statusCode: 500,
      body: `Serverless TTS fetch error: ${err.message}`,
    };
  }
}
