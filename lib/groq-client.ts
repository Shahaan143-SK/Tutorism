const API_KEY = "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"
const BASE_URL = "https://api.groq.com/openai/v1"

export const MODELS = {
  SPEECH_TO_TEXT: "whisper-large-v3-turbo",
  TEXT_GENERATION: "openai/gpt-oss-20b",
  TEXT_TO_SPEECH: "playai-tts",
  TTS_VOICE: "Fritz-PlayAI",
}

export const groqApi = {
  async chatCompletion(messages: { role: string; content: string }[]): Promise<string> {
    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODELS.TEXT_GENERATION,
        messages,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error("[v0] Chat completion error:", error)
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return data.choices?.[0]?.message?.content || ""
  },

  async textToSpeech(text: string): Promise<ArrayBuffer> {
    const MAX_TTS_CHARS = 900
    let truncatedText = text
    if (text.length > MAX_TTS_CHARS) {
      // Find a good breaking point (end of sentence)
      const breakPoint = text.lastIndexOf(".", MAX_TTS_CHARS)
      truncatedText = breakPoint > 0 ? text.substring(0, breakPoint + 1) : text.substring(0, MAX_TTS_CHARS)
    }

    const response = await fetch(`${BASE_URL}/audio/speech`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODELS.TEXT_TO_SPEECH,
        voice: MODELS.TTS_VOICE,
        input: truncatedText,
        response_format: "wav",
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(error)
    }

    return response.arrayBuffer()
  },

  async speechToText(audioBlob: Blob): Promise<string> {
    const formData = new FormData()
    formData.append("file", audioBlob, "recording.wav")
    formData.append("model", MODELS.SPEECH_TO_TEXT)
    formData.append("language", "en")
    formData.append("temperature", "0")

    const response = await fetch(`${BASE_URL}/audio/transcriptions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
      body: formData,
    })

    if (!response.ok) {
      const error = await response.text()
      console.error("[v0] STT error:", error)
      throw new Error(`STT API error: ${response.status}`)
    }

    const data = await response.json()
    return data.text || ""
  },
}
