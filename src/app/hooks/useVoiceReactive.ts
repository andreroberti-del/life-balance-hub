import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Hook que lê o microfone via Web Audio API e expõe a amplitude RMS em real-time.
 * Retorna valores de 0 a 1 (0 = silêncio, 1 = saturado).
 *
 * Uso:
 *   const { amplitude, isListening, start, stop, error } = useVoiceReactive();
 *   <ZenoCore amplitude={amplitude} state="listening" />
 */
export function useVoiceReactive() {
  const [amplitude, setAmplitude] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const dataRef = useRef<Uint8Array | null>(null);

  const stop = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      audioCtxRef.current.close().catch(() => undefined);
      audioCtxRef.current = null;
    }
    analyserRef.current = null;
    dataRef.current = null;
    setAmplitude(0);
    setIsListening(false);
  }, []);

  const start = useCallback(async () => {
    if (isListening) return;
    setError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      streamRef.current = stream;

      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new Ctx();
      audioCtxRef.current = ctx;

      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.7;
      source.connect(analyser);
      analyserRef.current = analyser;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      dataRef.current = dataArray;

      setIsListening(true);

      const tick = () => {
        const analyser = analyserRef.current;
        const data = dataRef.current;
        if (!analyser || !data) return;
        analyser.getByteTimeDomainData(data);

        // RMS calculation
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
          const v = (data[i] - 128) / 128;
          sum += v * v;
        }
        const rms = Math.sqrt(sum / data.length);
        // Smooth boost (most voice is in 0.05-0.3 RMS range)
        const normalized = Math.min(1, rms * 3);
        setAmplitude(normalized);

        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to access microphone';
      setError(msg);
      stop();
    }
  }, [isListening, stop]);

  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return { amplitude, isListening, start, stop, error };
}
