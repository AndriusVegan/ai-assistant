"use client";
// import transcript from "@/actions/transcript";
// import { useFormState } from "react-dom";
import { useEffect, useRef, useState } from "react";
// import Recorder from "@/components/Recorder";
// import VoiceSynthesizer from "@/components/VoiceSynthesizer";
// import Messages from "@/components/Messages";
import Messages from "@/components/Messages";
import Recorder, { mimeType } from "@/components/Recorder";
import { SettingsIcon } from "lucide-react";
import Image from "next/image";
import veganLogo from "@/img/go_vegan_logo.png";

export default function Home() {
  const fileRef = useRef<HTMLInputElement | null>(null);
  // connect input
  const submitButtonRef = useRef<HTMLButtonElement | null>(null);
  const uploadAudio = (blob: Blob) => {
    // const url = URL.createObjectURL(blob);
    const file = new File([blob], "audio.webm", { type: mimeType });
    // set the file as the value of the hidden file input field
    // putting file into this element
    if (fileRef.current) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      // assigns files to data transfer files
      fileRef.current.files = dataTransfer.files;
      // simulates the click (submit)
      if (submitButtonRef.current) {
        submitButtonRef.current.click();
      }
    }
  };
  return (
    <main className="bg-black h-screen overflow-y-scroll">
      {/* Header */}
      <header className="flex justify-between fixed top-0 text-white w-full p-5">
        <Image
          // src="https://i.imgur.com/MCHWJZS.png"
          src={veganLogo}
          alt="Logo"
          width={50}
          height={50}
          className="object-contain"
        />

        <SettingsIcon
          size={40}
          className="p-2 m-2 rounded-full cursor-pointer bg-purple-600
           text-black transition-all ease-in-out duration-150 hover:bg-purple-700 hover:text-white"
        ></SettingsIcon>
      </header>
      {/* Form */}

      <form className=" flex flex-col bg-black ">
        <div className="flex-1 bg-gradient-to-b from-purple-500 to-black">
          <Messages />
          <p>helllo vegan </p>
        </div>
        <input type="file" name="audio" hidden ref={fileRef} />
        <button type="submit" ref={submitButtonRef} hidden />

        <div className="fixed bottom-0 w-full overflow-hidden bg-black rounded-t-3xl">
          {/* recorder */}
          <Recorder uploadAudio={uploadAudio} />
          <div> {/* voice synthesizer */}</div>
        </div>
      </form>
    </main>
  );
}
