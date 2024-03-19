"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import activeAssistantIcon from "@/img/active.gif";
import notActiveAssistantIcon from "@/img/notactive.png";
import { useFormStatus } from "react-dom";

export const mimeType = "audio/webm";

function Recorder({ uploadAudio }: { uploadAudio: (blob: Blob) => void }) {
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const { pending } = useFormStatus();
  const [permission, setPermission] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recordingStatus, setRecordingStatus] = useState("inactive");
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

  useEffect(() => {
    getMicrophonePermissions();
  }, []);

  const getMicrophonePermissions = async () => {
    if ("MediaRecorder" in window) {
      try {
        const streamData = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        setPermission(true);
        setStream(streamData);
      } catch (err: any) {
        alert(err.message);
      }
    } else {
      alert("The MediaRecorder API is no supported in your browser");
    }
  };

  const startRecording = async () => {
    if (stream === null || pending) return;

    setRecordingStatus("recording");

    // Create a new media recorder instance using the stream, this bellow allows to capture audio
    const media = new MediaRecorder(stream, { mimeType });
    mediaRecorder.current = media;
    mediaRecorder.current.start();

    let localAudioChunks: Blob[] = [];
    mediaRecorder.current.ondataavailable = (event) => {
      if (typeof event.data === "undefined") return;
      if (event.data.size === 0) return;

      localAudioChunks.push(event.data);
    };
    setAudioChunks(localAudioChunks);

    const stopRecording = async () => {
      if (mediaRecorder.current === null || pending) return;

      setRecordingStatus("inactive");
      mediaRecorder.current.stop();
      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: mimeType });
        // const audioUrl = URL.createObjectURL(audioBlob);
        uploadAudio(audioBlob);
        setAudioChunks([]);
      };
    };
  };
  return (
    <div className="flex items-center justify-center text-white">
      {!permission && (
        <button onClick={getMicrophonePermissions}>Get Microphone</button>
      )}
      {pending && (
        <Image
          src={activeAssistantIcon}
          width={350}
          height={350}
          priority
          alt="Recording"
          className="assistant grayscale"
        />
      )}

      {permission && recordingStatus === "inactive" && !pending && (
        <Image
          src={notActiveAssistantIcon}
          width={350}
          height={350}
          priority={true}
          onClick={startRecording}
          alt="Recording"
          className="assistant cursor-pointer hover:scale-110 duration-150 transition-all ease-in-out"
        />
      )}

      {recordingStatus === "active" && (
        <Image
          src={activeAssistantIcon}
          width={350}
          height={350}
          priority={true}
          onClick={stopRecording}
          alt="Stop recording"
          className="assistant cursor-pointer hover:scale-110 duration-150 transition-all ease-in-out"
        />
      )}
    </div>
  );
}

export default Recorder;
