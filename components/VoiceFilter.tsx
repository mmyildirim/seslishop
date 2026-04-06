"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { parseVoiceCommand, FilterState, EMPTY_FILTER, describeFilter, isEmptyFilter } from "@/lib/nlp-filter";

interface Props {
  onFilterChange: (filter: FilterState) => void;
  currentFilter: FilterState;
}

type RecordingState = "idle" | "recording" | "processing" | "done" | "error" | "no-support";

const EXAMPLE_COMMANDS = [
  "Kırmızı mont göster",
  "150 lira altı ürünler",
  "Kadın elbise",
  "Siyah ayakkabı",
  "100 ile 200 arası kazak",
  "4 yıldız üzeri erkek ceket",
  "Stokta olan lacivert pantolon",
  "Filtreyi temizle",
];

export default function VoiceFilter({ onFilterChange, currentFilter }: Props) {
  const [state, setState] = useState<RecordingState>("idle");
  const [transcript, setTranscript] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [pulse, setPulse] = useState(false);
  const [exampleIdx, setExampleIdx] = useState(0);
  const [intentInfo, setIntentInfo] = useState<{ intent: string; confidence: number } | null>(null);
  const recognitionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const interval = setInterval(() => setExampleIdx((i) => (i + 1) % EXAMPLE_COMMANDS.length), 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) setState("no-support");
  }, []);

  const callModel = useCallback(async (text: string) => {
    setState("processing");
    try {
      const filter = await parseVoiceCommand(text);
      setIntentInfo({ intent: filter.intent, confidence: filter.intentConfidence });
      onFilterChange(filter);
      setState("done");
    } catch (err: any) {
      setErrorMsg(`Model bağlantı hatası: ${err.message}`);
      setState("error");
    }
  }, [onFilterChange]);

  const stopRecording = useCallback(() => {
    recognitionRef.current?.stop();
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t: MediaStreamTrack) => t.stop());
      streamRef.current = null;
    }
    setPulse(false);
  }, []);

  const startRecording = useCallback(async () => {
    setErrorMsg(""); setTranscript(""); setIntentInfo(null);
    setState("recording"); setPulse(true);
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) { setState("no-support"); return; }
    try {
      streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recognition = new SpeechRec();
      recognitionRef.current = recognition;
      recognition.lang = "tr-TR";
      recognition.interimResults = true;
      recognition.maxAlternatives = 3;
      recognition.continuous = false;
      recognition.onresult = (event: any) => {
        let final = ""; let interim = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const t = event.results[i][0].transcript;
          if (event.results[i].isFinal) final += t; else interim += t;
        }
        const current = final || interim;
        setTranscript(current);
        recognition._lastTranscript = current;
      };
      recognition.onend = () => {
        setPulse(false);
        const text = recognition._lastTranscript || "";
        if (text.trim()) callModel(text);
        else { setErrorMsg("Ses algılanamadı."); setState("error"); }
      };
      recognition.onerror = (event: any) => {
        setPulse(false);
        if (event.error === "not-allowed") setErrorMsg("Mikrofon izni verilmedi.");
        else if (event.error === "no-speech") setErrorMsg("Ses algılanamadı.");
        else setErrorMsg(`Hata: ${event.error}`);
        setState("error");
      };
      recognition.start();
    } catch { setErrorMsg("Mikrofon erişimi reddedildi."); setState("error"); setPulse(false); }
  }, [callModel]);

  const clearFilter = () => { onFilterChange(EMPTY_FILTER); setTranscript(""); setIntentInfo(null); setState("idle"); };
  const tryExample = (cmd: string) => { setTranscript(cmd); callModel(cmd); };
  const hasFilter = !isEmptyFilter(currentFilter);

  return (
    <div className="voice-filter-container">
      <div className="mic-area">
        <div className="mic-title">
          <span className="mic-icon-label">🎙️</span>
          <h2>Sesli Arama</h2>
          <p>Ne aramak istiyorsunuz?</p>
        </div>
        <button
          className={`mic-btn ${state === "recording" ? "recording" : ""} ${state === "no-support" ? "disabled" : ""}`}
          onClick={() => state === "recording" ? stopRecording() : startRecording()}
          disabled={state === "no-support" || state === "processing"}
        >
          {pulse && <span className="pulse-ring ring1" />}
          {pulse && <span className="pulse-ring ring2" />}
          {pulse && <span className="pulse-ring ring3" />}
          <span className="mic-icon">
            {state === "recording" ? "⏹" : state === "processing" ? "⏳" : "🎤"}
          </span>
        </button>
        <div className={`status-msg status-${state}`}>
          {state === "idle" && "Mikrofona tıklayın ve konuşun"}
          {state === "recording" && "Dinleniyor..."}
          {state === "processing" && "Model analiz ediyor..."}
          {state === "done" && "✅ Filtre uygulandı!"}
          {state === "error" && `❌ ${errorMsg}`}
          {state === "no-support" && "⚠️ Tarayıcınız desteklemiyor"}
        </div>
        {transcript && (
          <div className="transcript-box">
            <span className="transcript-label">Algılanan</span>
            <span className="transcript-text">"{transcript}"</span>
          </div>
        )}
        {intentInfo && (
          <div className="intent-badge">
            <span className={`intent-tag intent-${intentInfo.intent.toLowerCase()}`}>
              {intentInfo.intent}
            </span>
            <span className="intent-conf">%{Math.round(intentInfo.confidence * 100)} güven</span>
          </div>
        )}
      </div>

      {hasFilter && (
        <div className="active-filters">
          <div className="filter-summary">
            <span className="filter-summary-label">Aktif Filtre</span>
            <span className="filter-summary-text">{describeFilter(currentFilter)}</span>
          </div>
          <button className="clear-btn" onClick={clearFilter}>✕ Temizle</button>
        </div>
      )}

      <div className="examples-section">
        <p className="examples-title">Örnek komutlar</p>
        <div className="examples-scroll">
          {EXAMPLE_COMMANDS.map((cmd, i) => (
            <button key={i} className={`example-chip ${i === exampleIdx ? "highlighted" : ""}`} onClick={() => tryExample(cmd)}>
              {cmd}
            </button>
          ))}
        </div>
      </div>

      <div className="manual-input-section">
        <form onSubmit={(e) => { e.preventDefault(); const v = (e.currentTarget.elements.namedItem("query") as HTMLInputElement).value; if (v.trim()) { setTranscript(v); callModel(v); } }}>
          <input name="query" type="text" placeholder="ya da buraya yazın..." className="manual-input" />
          <button type="submit" className="manual-submit">Ara</button>
        </form>
      </div>
    </div>
  );
}
