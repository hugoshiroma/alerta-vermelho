export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private chunks: Blob[] = [];
  private stream: MediaStream | null = null;

  async start(): Promise<void> {
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.chunks = [];

    const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
      ? "audio/webm;codecs=opus"
      : "audio/webm";

    this.mediaRecorder = new MediaRecorder(this.stream, { mimeType });
    this.mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) this.chunks.push(e.data);
    };
    this.mediaRecorder.start(1000);
  }

  stop(): void {
    if (!this.mediaRecorder) return;
    this.mediaRecorder.onstop = () => {
      this.saveRecording();
      this.stream?.getTracks().forEach((t) => t.stop());
    };
    this.mediaRecorder.stop();
  }

  private saveRecording(): void {
    const blob = new Blob(this.chunks, { type: "audio/webm" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gravacao-emergencia-${new Date().toISOString().slice(0, 19).replace(/:/g, "-")}.webm`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }

  get isRecording(): boolean {
    return this.mediaRecorder?.state === "recording";
  }
}
