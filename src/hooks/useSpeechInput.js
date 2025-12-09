
"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export const useSpeechInput = (opts) => {
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    const recognition = new SR();
    recognition.lang = (opts && opts.lang) || "en-US";
    recognition.continuous = Boolean(opts && opts.continuous);
    recognition.interimResults = Boolean(opts && opts.interimResults);
    recognition.maxAlternatives = (opts && opts.maxAlternatives) || 1;

    recognition.onresult = (event) => {
      let finalText = "";
      let interimText = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalText += (result[0] && result[0].transcript) || "";
          if (i < event.results.length - 1) finalText += " ";
        } else {
          interimText += (result[0] && result[0].transcript) || "";
          interimText += " ";
        }
      }

      if (finalText.trim()) {
        setTranscript((prev) => (opts && opts.continuous ? `${prev} ${finalText.trim()}`.trim() : finalText.trim()));
        if (opts && typeof opts.onResult === "function") opts.onResult(finalText.trim(), event);
      }

      setInterimTranscript(interimText.trim());
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.onresult = null;
        recognition.onend = null;
        recognition.onerror = null;
        recognition.abort && recognition.abort();
      } catch {}
      recognitionRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const start = useCallback(() => {
    if (!recognitionRef.current) return;
    try {
      setInterimTranscript("");
      recognitionRef.current.start();
      setIsListening(true);
    } catch {}
  }, []);

  const stop = useCallback(() => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
    } catch {}
    setIsListening(false);
  }, []);

  const abort = useCallback(() => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.abort();
    } catch {}
    setIsListening(false);
  }, []);

  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) return;
    if (isListening) {
      stop();
    } else {
      setInterimTranscript("");
      start();
    }
  }, [isListening, start, stop]);

  const resetTranscript = useCallback(() => {
    setTranscript("");
    setInterimTranscript("");
  }, []);

  return {
    transcript,
    interimTranscript,
    isListening,
    start,
    stop,
    abort,
    toggleListening,
    resetTranscript,
  };
};
