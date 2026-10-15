"use client";

import { Plus, Printer, RotateCcw, Trash2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn, uid } from "@/lib/utils";

/* ------------------------------------------------------------------ types */
interface Experience {
  id: string;
  role: string;
  company: string;
  start: string;
  end: string;
  details: string; // one bullet per line
}
interface Education {
  id: string;
  degree: string;
  school: string;
  start: string;
  end: string;
}
interface CvData {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string; // comma separated
  accent: string;
}

const STORAGE_KEY = "toolza:cv:v1";
const A4_W = 794; // 210mm @ 96dpi
const A4_H = 1123; // 297mm @ 96dpi

const accents = ["#4f46e5", "#0f766e", "#b91c1c", "#1d4ed8", "#7c3aed", "#111827"];

const sample: CvData = {
  name: "Alex Morgan",
  title: "Product Designer",
  email: "alex.morgan@example.com",
  phone: "+1 555 010 2030",
  location: "Austin, TX",
  website: "alexmorgan.design",
  summary:
    "Product designer with 6+ years of experience shipping user-centered web and mobile products. Strong in research, prototyping and collaborating with engineers to deliver measurable results.",
  experience: [
    {
      id: "e1",
      role: "Senior Product Designer",
      company: "Brightline",
      start: "2022",
      end: "Present",
      details:
        "Led redesign of the onboarding flow, increasing activation by 24%\nBuilt and maintained a design system used by 5 product teams\nMentored 3 junior designers",
    },
    {
      id: "e2",
      role: "UX Designer",
      company: "Northwind Labs",
      start: "2019",
      end: "2022",
      details: "Ran 40+ usability studies and translated findings into roadmap items\nShipped a mobile app with 4.7★ average rating",
    },
  ],
  education: [{ id: "d1", degree: "B.A. Interaction Design", school: "University of Texas", start: "2015", end: "2019" }],
  skills: "Figma, User Research, Prototyping, Design Systems, HTML & CSS, Accessibility",
  accent: accents[0],
};

const blank: CvData = {
  name: "",
  title: "",
  email: "",
  phone: "",
  location: "",
  website: "",
  summary: "",
  experience: [],
  education: [],
  skills: "",
  accent: accents[0],
};

/* ------------------------------------------------------------- component */
export default function CvBuilder() {
  const [data, setData] = useState<CvData>(sample);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage once on mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setData({ ...blank, ...(JSON.parse(raw) as Partial<CvData>) });
    } catch {
      /* corrupted or unavailable storage — keep sample */
    }
    setLoaded(true);
  }, []);

  // Persist on every change (after the initial load to avoid overwriting saved data).
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      /* quota or private mode */
    }
  }, [data, loaded]);

  const set = <K extends keyof CvData>(key: K, value: CvData[K]) => setData((d) => ({ ...d, [key]: value }));

  const updateExp = (id: string, patch: Partial<Experience>) =>
    set("experience", data.experience.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  const updateEdu = (id: string, patch: Partial<Education>) =>
    set("education", data.education.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  /* ---- scale the A4 sheet to fit the preview column on screen ---- */
  const wrapRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [sheetH, setSheetH] = useState(A4_H);

  const measure = useCallback(() => {
    if (wrapRef.current) setScale(Math.min(1, wrapRef.current.clientWidth / A4_W));
    if (sheetRef.current) setSheetH(Math.max(A4_H, sheetRef.current.scrollHeight));
  }, []);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (wrapRef.current) ro.observe(wrapRef.current);
    if (sheetRef.current) ro.observe(sheetRef.current);
    return () => ro.disconnect();
  }, [measure]);

  const skills = data.skills.split(",").map((s) => s.trim()).filter(Boolean);
  const contact = [data.email, data.phone, data.location, data.website].filter(Boolean);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] xl:grid-cols-[minmax(0,460px)_minmax(0,1fr)] print:block">
      {/* ======================================================== FORM */}
      <div className="space-y-5 print:hidden">
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" className="btn-primary" onClick={() => window.print()}>
            <Printer className="h-4 w-4" /> Download PDF
          </button>
          <button
            type="button"
            className="btn-outline"
            onClick={() => confirm("Clear all fields?") && setData({ ...blank, accent: data.accent })}
          >
            <Trash2 className="h-4 w-4" /> Clear
          </button>
          <button type="button" className="btn-ghost" onClick={() => setData(sample)}>
            <RotateCcw className="h-4 w-4" /> Sample
          </button>
        </div>
        <p className="text-xs text-muted-foreground">
          Auto-saved in your browser. Choose “Save as PDF” in the print dialog.
        </p>

        <section className="panel space-y-3">
          <h2 className="font-semibold">Personal details</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input label="Full name" value={data.name} onChange={(v) => set("name", v)} />
            <Input label="Job title" value={data.title} onChange={(v) => set("title", v)} />
            <Input label="Email" type="email" value={data.email} onChange={(v) => set("email", v)} />
            <Input label="Phone" value={data.phone} onChange={(v) => set("phone", v)} />
            <Input label="Location" value={data.location} onChange={(v) => set("location", v)} />
            <Input label="Website / LinkedIn" value={data.website} onChange={(v) => set("website", v)} />
          </div>
          <div>
            <span className="label">Accent color</span>
            <div className="flex gap-2">
              {accents.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => set("accent", c)}
                  aria-label={`Accent ${c}`}
                  aria-pressed={data.accent === c}
                  className={cn("h-7 w-7 rounded-full border-2 border-background ring-offset-2 ring-offset-background", data.accent === c && "ring-2 ring-ring")}
                  style={{ background: c }}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="panel space-y-3">
          <h2 className="font-semibold">Summary</h2>
          <textarea className="field" rows={4} value={data.summary} onChange={(e) => set("summary", e.target.value)} placeholder="A short professional summary…" />
        </section>

        <section className="panel space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Experience</h2>
            <button
              type="button"
              className="btn-outline btn-sm"
              onClick={() => set("experience", [...data.experience, { id: uid(), role: "", company: "", start: "", end: "", details: "" }])}
            >
              <Plus className="h-3.5 w-3.5" /> Add
            </button>
          </div>
          {data.experience.map((x) => (
            <div key={x.id} className="space-y-3 rounded-md border p-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <Input label="Role" value={x.role} onChange={(v) => updateExp(x.id, { role: v })} />
                <Input label="Company" value={x.company} onChange={(v) => updateExp(x.id, { company: v })} />
                <Input label="Start" value={x.start} onChange={(v) => updateExp(x.id, { start: v })} />
                <Input label="End" value={x.end} onChange={(v) => updateExp(x.id, { end: v })} />
              </div>
              <div>
                <label className="label">Achievements (one per line)</label>
                <textarea className="field" rows={4} value={x.details} onChange={(e) => updateExp(x.id, { details: e.target.value })} />
              </div>
              <button type="button" className="btn-ghost btn-sm text-destructive" onClick={() => set("experience", data.experience.filter((e) => e.id !== x.id))}>
                <Trash2 className="h-3.5 w-3.5" /> Remove
              </button>
            </div>
          ))}
          {data.experience.length === 0 && <p className="text-sm text-muted-foreground">No experience added yet.</p>}
        </section>

        <section className="panel space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Education</h2>
            <button
              type="button"
              className="btn-outline btn-sm"
              onClick={() => set("education", [...data.education, { id: uid(), degree: "", school: "", start: "", end: "" }])}
            >
              <Plus className="h-3.5 w-3.5" /> Add
            </button>
          </div>
          {data.education.map((x) => (
            <div key={x.id} className="space-y-3 rounded-md border p-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <Input label="Degree" value={x.degree} onChange={(v) => updateEdu(x.id, { degree: v })} />
                <Input label="School" value={x.school} onChange={(v) => updateEdu(x.id, { school: v })} />
                <Input label="Start" value={x.start} onChange={(v) => updateEdu(x.id, { start: v })} />
                <Input label="End" value={x.end} onChange={(v) => updateEdu(x.id, { end: v })} />
              </div>
              <button type="button" className="btn-ghost btn-sm text-destructive" onClick={() => set("education", data.education.filter((e) => e.id !== x.id))}>
                <Trash2 className="h-3.5 w-3.5" /> Remove
              </button>
            </div>
          ))}
          {data.education.length === 0 && <p className="text-sm text-muted-foreground">No education added yet.</p>}
        </section>

        <section className="panel space-y-3">
          <h2 className="font-semibold">Skills</h2>
          <textarea className="field" rows={3} value={data.skills} onChange={(e) => set("skills", e.target.value)} placeholder="Comma separated: React, Figma, SQL" />
        </section>
      </div>

      {/* ===================================================== PREVIEW */}
      <div className="min-w-0 print:block">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground print:hidden">
          Live preview · A4
        </p>
        <div ref={wrapRef} className="w-full lg:sticky lg:top-24 print:!h-auto" style={{ height: sheetH * scale }}>
          <div
            id="cv-print"
            ref={sheetRef}
            className="bg-white text-[13px] leading-snug text-neutral-800 shadow-xl ring-1 ring-black/10"
            style={{ width: A4_W, minHeight: A4_H, padding: "14mm", transform: `scale(${scale})`, transformOrigin: "top left" }}
          >
            <header className="border-b-2 pb-4" style={{ borderColor: data.accent }}>
              <h1 className="text-[30px] font-bold leading-tight text-neutral-900">{data.name || "Your Name"}</h1>
              {data.title && (
                <p className="mt-0.5 text-[16px] font-medium" style={{ color: data.accent }}>{data.title}</p>
              )}
              {contact.length > 0 && (
                <p className="mt-2 text-[12px] text-neutral-600">{contact.join("  •  ")}</p>
              )}
            </header>

            {data.summary && (
              <Section title="Profile" color={data.accent}>
                <p className="whitespace-pre-line">{data.summary}</p>
              </Section>
            )}

            {data.experience.length > 0 && (
              <Section title="Experience" color={data.accent}>
                <div className="space-y-4">
                  {data.experience.map((x) => (
                    <div key={x.id} style={{ breakInside: "avoid" }}>
                      <div className="flex items-baseline justify-between gap-3">
                        <p className="font-semibold text-neutral-900">
                          {x.role}
                          {x.role && x.company && <span className="font-normal text-neutral-600"> · {x.company}</span>}
                          {!x.role && x.company}
                        </p>
                        <p className="shrink-0 text-[12px] text-neutral-500">{[x.start, x.end].filter(Boolean).join(" – ")}</p>
                      </div>
                      <ul className="mt-1 list-disc space-y-0.5 pl-5">
                        {x.details.split("\n").filter((l) => l.trim()).map((l, i) => (
                          <li key={i}>{l}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {data.education.length > 0 && (
              <Section title="Education" color={data.accent}>
                <div className="space-y-2">
                  {data.education.map((x) => (
                    <div key={x.id} className="flex items-baseline justify-between gap-3" style={{ breakInside: "avoid" }}>
                      <p className="font-semibold text-neutral-900">
                        {x.degree}
                        {x.degree && x.school && <span className="font-normal text-neutral-600"> · {x.school}</span>}
                        {!x.degree && x.school}
                      </p>
                      <p className="shrink-0 text-[12px] text-neutral-500">{[x.start, x.end].filter(Boolean).join(" – ")}</p>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {skills.length > 0 && (
              <Section title="Skills" color={data.accent}>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((s, i) => (
                    <span
                      key={`${s}-${i}`}
                      className="rounded px-2 py-0.5 text-[12px]"
                      style={{ background: `${data.accent}14`, color: data.accent }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </Section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- helpers */
function Section({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <section className="mt-5">
      <h2 className="mb-2 text-[12px] font-bold uppercase tracking-[0.12em]" style={{ color }}>
        {title}
      </h2>
      {children}
    </section>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  const id = `f-${label.replace(/\W+/g, "-").toLowerCase()}-${useRef(uid()).current}`;
  return (
    <div>
      <label htmlFor={id} className="label">{label}</label>
      <input id={id} type={type} className="field" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
