"use server";

import {
  AzureKeyCredential,
  ChatRequestMessage,
  OpenAIClient,
} from "@azure/openai";

async function transcript(prevState: any, formData: FormData) {
  //   "use server";

  const id = Math.random().toString(36);

  console.log("PREVIOUS STATE:", prevState);
  if (
    process.env.AZURE_API_KEY === undefined ||
    process.env.AZURE_ENDPOINT === undefined ||
    process.env.AZURE_DEPLOYMENT_NAME === undefined ||
    process.env.AZURE_DEPLOYMENT_COMPLETIONS_NAME === undefined
  ) {
    console.error("Azure credentials not set");
    return {
      sender: "",
      response: "Azure credentials not set",
    };
  }

  const file = formData.get("audio") as File;
  if (file.size === 0) {
    return {
      sender: "",
      response: "No audio file provided",
    };
  }

  console.log(">>", file);

  const arrayBuffer = await file.arrayBuffer();
  const audio = new Uint8Array(arrayBuffer);

  //    get audio transcription from azure whisper ai

  console.log("== Transcribe AUdio sample ==");

  const client = new OpenAIClient(
    process.env.AZURE_ENDPOINT,
    new AzureKeyCredential(process.env.AZURE_API_KEY)
  );
  // get test from voice/audio also can do translation to another language
  const result = await client.getAudioTranscription(
    process.env.AZURE_DEPLOYMENT_NAME,
    audio
  );
  console.log(`Transcription: ${result.text}`);

  // ---   get chat completion from Azure OpenAI ---- ; passing text to azure ai Whisper

  const messages: ChatRequestMessage[] = [
    {
      role: "system",
      content:
        "You are a helpful assistant. You will answer questions and reply I cannot answer that if you don't know the answer.",
    },
    { role: "user", content: result.text },
    // content is voice transcription
  ];

  console.log(`Messages: ${messages.map((m) => m.content).join("\n")}`);

  const completions = await client.getChatCompletions(
    process.env.AZURE_DEPLOYMENT_COMPLETIONS_NAME,
    messages,
    { maxTokens: 128 }
  );

  console.log("chatbot: ", completions.choices[0].message?.content);

  const response = completions.choices[0].message?.content;

  console.log(prevState.sender, "+++", result.text);

  //   sending data/answer back to the user
  return {
    sender: result.text,
    response: response,
    id: id,
  };
}

export default transcript;
