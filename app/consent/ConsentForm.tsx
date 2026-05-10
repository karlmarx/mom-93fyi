"use client";

import { useEffect, useRef, useState } from "react";

export default function ConsentForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [signed, setSigned] = useState(false);
  const sigPadRef = useRef<HTMLCanvasElement>(null);
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const n = params.get("name");
    const p = params.get("phone");
    if (n) setName(n);
    if (p) setPhone(p);
  }, []);

  useEffect(() => {
    const canvas = sigPadRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#1a1a1a";
    ctx.lineCap = "round";

    let drawing = false;
    let last: { x: number; y: number } | null = null;

    const pos = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const t =
        "touches" in e ? e.touches[0] ?? e.changedTouches[0] : (e as MouseEvent);
      return { x: t.clientX - rect.left, y: t.clientY - rect.top };
    };

    const start = (e: MouseEvent | TouchEvent) => {
      drawing = true;
      last = pos(e);
      e.preventDefault();
    };
    const move = (e: MouseEvent | TouchEvent) => {
      if (!drawing || !last) return;
      const p = pos(e);
      ctx.beginPath();
      ctx.moveTo(last.x, last.y);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      last = p;
      e.preventDefault();
    };
    const end = () => {
      if (drawing) setSigned(true);
      drawing = false;
    };

    canvas.addEventListener("mousedown", start);
    canvas.addEventListener("mousemove", move);
    canvas.addEventListener("mouseup", end);
    canvas.addEventListener("mouseleave", end);
    canvas.addEventListener("touchstart", start, { passive: false });
    canvas.addEventListener("touchmove", move, { passive: false });
    canvas.addEventListener("touchend", end);

    return () => {
      canvas.removeEventListener("mousedown", start);
      canvas.removeEventListener("mousemove", move);
      canvas.removeEventListener("mouseup", end);
      canvas.removeEventListener("mouseleave", end);
      canvas.removeEventListener("touchstart", start);
      canvas.removeEventListener("touchmove", move);
      canvas.removeEventListener("touchend", end);
    };
  }, []);

  const clearSig = () => {
    const canvas = sigPadRef.current;
    if (!canvas) return;
    canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
    setSigned(false);
  };

  const downloadPng = () => {
    if (!signed || !name.trim() || !phone.trim()) {
      alert("Fill name and phone, then sign before exporting.");
      return;
    }

    const out = document.createElement("canvas");
    out.width = 1200;
    out.height = 1500;
    const ctx = out.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, out.width, out.height);

    ctx.fillStyle = "#1a1a1a";
    ctx.font = "bold 36px serif";
    ctx.fillText("SMS Consent · mom.93.fyi", 60, 80);

    ctx.font = "20px serif";
    ctx.fillText(`Recipient name: ${name}`, 60, 140);
    ctx.fillText(`Recipient phone: ${phone}`, 60, 175);
    ctx.fillText(`Date: ${today}`, 60, 210);

    const body = [
      `I, ${name}, consent to receive SMS replies at ${phone} from the`,
      `93.fyi family communication line operated by Karl Marx-Levi`,
      `(k@93.fyi, +1 954 495 7268). This is a personal,`,
      `non-commercial messaging service that only sends replies to`,
      `questions I send first. I can reply STOP at any time to opt`,
      `out, or HELP for assistance. Standard message and data rates`,
      `may apply.`,
    ];
    ctx.font = "20px serif";
    let y = 270;
    body.forEach((line) => {
      ctx.fillText(line, 60, y);
      y += 32;
    });

    ctx.fillText("Recipient signature:", 60, y + 30);
    ctx.strokeStyle = "#999";
    ctx.lineWidth = 1;
    ctx.strokeRect(60, y + 50, 600, 180);
    if (sigPadRef.current) {
      ctx.drawImage(sigPadRef.current, 60, y + 50, 600, 180);
    }

    ctx.fillStyle = "#666";
    ctx.font = "italic 16px serif";
    ctx.fillText(
      `Captured at mom.93.fyi/consent on ${today}`,
      60,
      out.height - 40,
    );

    out.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      const a = document.createElement("a");
      a.href = url;
      a.download = `consent-${slug || "recipient"}-${today}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, "image/png");
  };

  const ready = signed && name.trim() && phone.trim();

  return (
    <main className="mx-auto max-w-xl px-6 py-12 font-[family-name:var(--font-lora)] text-ink/90 leading-relaxed">
      <h1 className="mb-4 text-2xl font-semibold">SMS Consent</h1>

      <p className="mb-6 text-sm">
        This page captures explicit, written consent to receive SMS replies
        from the 93.fyi family line. Fill in your name and phone, sign below,
        then download the PNG.
      </p>

      <label className="mb-3 block text-sm">
        <span className="block font-semibold">Your name</span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded border border-ink/30 bg-white px-2 py-1 text-base"
          placeholder="e.g. Susan Marx"
          autoComplete="name"
        />
      </label>

      <label className="mb-3 block text-sm">
        <span className="block font-semibold">Your phone (the one receiving SMS)</span>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="mt-1 w-full rounded border border-ink/30 bg-white px-2 py-1 text-base"
          placeholder="+1 555 123 4567"
          autoComplete="tel"
        />
      </label>

      <p className="mb-3 text-xs text-ink-soft">Date: {today}</p>

      <div className="mb-4 rounded border border-ink/20 bg-paper-aged/40 p-3 text-sm">
        I, <strong>{name || "______________"}</strong>, consent to receive SMS
        replies at <strong>{phone || "______________"}</strong> from the
        93.fyi family communication line operated by Karl Marx-Levi
        (k@93.fyi, +1 954 495 7268). This is a personal, non-commercial
        messaging service that only sends replies to questions I send first.
        I can reply <strong>STOP</strong> at any time to opt out, or{" "}
        <strong>HELP</strong> for assistance. Standard message and data rates
        may apply.
      </div>

      <p className="mb-2 text-sm font-semibold">Sign below</p>
      <canvas
        ref={sigPadRef}
        width={500}
        height={150}
        className="w-full rounded border border-ink/40 bg-white"
        style={{ touchAction: "none" }}
      />

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={clearSig}
          className="rounded border border-ink/30 bg-white px-3 py-1 text-sm"
        >
          Clear signature
        </button>
        <button
          type="button"
          onClick={downloadPng}
          disabled={!ready}
          className="rounded bg-ink px-3 py-1 text-sm text-paper disabled:opacity-50"
        >
          Download consent PNG
        </button>
      </div>

      <p className="mt-6 text-xs text-ink-soft">
        After download, commit the PNG to{" "}
        <code>public/consent/</code> and push so it&apos;s served at a stable
        URL. That URL becomes the <code>opt_in_image_urls</code> value on the
        Twilio toll-free verification.
      </p>
    </main>
  );
}
