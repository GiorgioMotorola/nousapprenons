export async function handler(event, context) {
  const API_KEY = process.env.VOICERSS_API_KEY; 
  const text = event.queryStringParameters?.text;

  if (!text) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing 'text' parameter" }),
    };
  }

  const url = `https://api.voicerss.org/?key=${API_KEY}&hl=fr-fr&src=${encodeURIComponent(
    text
  )}&c=MP3&f=44khz_16bit_stereo`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`VoiceRSS error: ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();

    return {
      statusCode: 200,
      headers: { "Content-Type": "audio/mpeg" },
      body: Buffer.from(arrayBuffer).toString("base64"),
      isBase64Encoded: true,
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
