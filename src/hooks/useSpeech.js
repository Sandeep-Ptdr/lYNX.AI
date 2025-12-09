"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useToast } from "@/hooks/useToast";

export function useSpeech(options) {
  const { toast } = useToast();
  const utteranceRef = useRef(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const voicesRef = useRef([]);

  const loadVoices = useCallback(() => {
    const voices = (window.speechSynthesis && window.speechSynthesis.getVoices()) || [];
    voicesRef.current = voices;
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    loadVoices();
    const onVoicesChanged = () => loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", onVoicesChanged);

    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", onVoicesChanged);
      try {
        window.speechSynthesis.cancel();
      } catch {}
    };
  }, [loadVoices]);

  const stop = useCallback(() => {
    try {
      window.speechSynthesis.cancel();
      utteranceRef.current = null;
      setIsSpeaking(false);
    } catch {}
  }, []);

  const speak = useCallback(
    (text, speechOptions) => {
      try {
        if (typeof window === "undefined" || !("speechSynthesis" in window)) {
          toast({
            title: "❌ Speech synthesis not supported in this browser",
            variant: "destructive",
          });
          return;
        }

        stop();

        const opts = Object.assign(
          { rate: 1, pitch: 1.2, volume: 1, lang: "en-US", preferVoiceNameIncludes: ["Google UK English Female", "Google US English", "natural"] },
          options || {},
          speechOptions || {}
        );

        const cleanText = (text || "")
          .replace(/```[\s\S]*?```/g, "code block")
          .replace(/`([^`]+)`/g, "$1")
          .replace(/^\s*#+\s*/gm, "")
          .replace(/[*_~]/g, "")
          .trim();

        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = opts.lang;
        utterance.rate = opts.rate;
        utterance.pitch = opts.pitch;
        utterance.volume = opts.volume;

        const voices = voicesRef.current || [];
        let preferredVoice;
        for (const token of opts.preferVoiceNameIncludes || []) {
          preferredVoice = voices.find((v) => (v.name && v.name.includes(token)) || (v.name && v.name.toLowerCase().includes(token.toLowerCase())));
          if (preferredVoice) break;
        }
        if (!preferredVoice) {
          preferredVoice = voices.find((v) => v.lang === "en-US") || voices[0];
        }
        if (preferredVoice) utterance.voice = preferredVoice;

        utterance.onstart = () => {
          utteranceRef.current = utterance;
          setIsSpeaking(true);
          toast?.({
            title: "🔊 Neural voice synthesis activated",
            duration: 2000,
          });
        };

        utterance.onerror = () => {
          setIsSpeaking(false);
          toast?.({
            title: "❌ Speech synthesis failed",
            variant: "destructive",
          });
        };

        utterance.onend = () => {
          utteranceRef.current = null;
          setIsSpeaking(false);
        };

        window.speechSynthesis.speak(utterance);
      } catch (e) {
        toast?.({
          title: "❌ Speech synthesis failed",
          variant: "destructive",
        });
      }
    },
    [options, stop, toast]
  );

  useEffect(() => {
    return () => {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    };
  }, []);

  return { speak, stop, isSpeaking };
}
