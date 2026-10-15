"use client";

import { useEffect, useState } from "react";
import { Plus, Printer, RotateCcw, Trash2 } from "lucide-react";
import { uid } from "@/lib/utils";

interface Experience {
  id: string;
  role: string;
  company: string;
  start: string;
  end: string;
  details: string;
}
interface Education {
  id: string;
  degree: string;
  school: string;
  start: string;
  end: string;
}
interface CV {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  summary: string;
  skills: string;
  accent: string;
  experience: Experience[];
  education: Education[];
}

const STORAGE_KEY = "toolza-cv-v1";

const SAMPLE: CV = {
  name: "Alex Morgan",
  title: "Product Designer",
  email: "alex@example.com",
  phone: "+1 555 010 2030",
  location: "Berlin, Germany",
  website: "alexmorgan.design",
  summary:
    "Product designer with 6 years of experience turning complex problems into simple, accessible interfaces. Comfortable working across research, prototyping and handoff.",
  skills: "Figma, User research, Prototyping, Design systems, HTML & CSS",
  accent: "#4f46e5",
  experience: [
    {
      id: "e1",
      role: "Senior Product Designer",
      company: "Northwind",
      start: "2022",
      end: "Present",
      details: "Led the redesign of the onboarding flow, raising activation by 18%.\nBuilt and maintained a shared design system used by 4 teams.",
    },
  ],
  education: [{ id: "d1", degree: "BA Interaction Design", school: "University of the Arts", start: "2015", end: "2018" }],
};

const lines = (s: string) => s.split("\n").map((l) => l.trim()).filter(Boolean);
const dates = (a: string, b: string) => [a, b].filter(Boolean).join(" – ");

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium">{label}</span>
      {children}
    </label>
  );
}

export function CvBuilder() {
  const [cv, setCv] = useState<CV>(SAMPLE);
  const [loaded, setLoaded] = useState(false);

  // Load saved draft
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setCv({ ...SAMPLE, ...JSON.parse(raw) });
    } catch {
      /* ignore corrupt or unavailable storage */
    }
    setLoaded(true);
  }, []);

  // Autosave (only after the initial load so we never overwrite a draft with the sample)
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cv));
    } catch {
      /* storage full or blocked */
    }
  }, [cv, loaded]);

  const set = <K extends keyof CV>(key: K, value: CV[K]) => setCv((p) => ({ ...p, [key]: value }));

  const updateExp = (id: string, patch: Partial<Experience>) =>
    set("experience", cv.experience.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  const updateEdu = (id: string, patch: Partial<Education>) =>
    set("education", cv.education.map((e) => (e.id === id ? { ...e, ...patch } : e)));

  const contact = [cv.email, cv.phone, cv.location, cv.website].filter(Boolean);
  const skills = cv.skills.split(",").map((s) => s.trim()).filter(Boolean);

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,460px)_minmax(0,1fr)]">
      {/* Print only the A4 sheet */}
      <style>{`@media print{body *{visibility:hidden}#cv-sheet,#cv-sheet *{visibility:visible}#cv-sheet{position:absolute;left:0;top:0}}`}</style>

      {/* ---------- Form ---------- */}
      <div className="space-y-6 print:hidden">
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn-primary" onClick={() => window.print()}>
            <Printer className="h-4 w-4" /> Export PDF
          </button>
          <button
            type="button"
            className="btn-outline"
            onClick={() => {
              if (confirm("Reset the CV to the sample template? Your current data will be lost.")) setCv(SAMPLE);
            }}
          >
            <RotateCcw className="h-4 w-4" /> Reset
          </button>
          <p className="w-full text-xs text-muted-foreground">
            Tip: in the print dialog choose “Save as PDF”, and turn off “Headers and footers”. Your draft is
            saved automatically in this browser.
          </p>
        </div>

        <fieldset className="card space-y-3 p-4">
          <legend className="px-1 text-sm font-semibold">Personal details</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Full name">
              <input className="input" value={cv.name} onChange={(e) => set("name", e.target.value)} />
            </Field>
            <Field label="Job title">
              <input className="input" value={cv.title} onChange={(e) => set("title", e.target.value)} />
            </Field>
            <Field label="Email">
              <input className="input" type="email" value={cv.email} onChange={(e) => set("email", e.target.value)} />
            </Field>
            <Field label="Phone">
              <input className="input" value={cv.phone} onChange={(e) => set("phone", e.target.value)} />
            </Field>
            <Field label="Location">
              <input className="input" value={cv.location} onChange={(e) => set("location", e.target.value)} />
            </Field>
            <Field label="Website / LinkedIn">
              <input className="input" value={cv.website} onChange={(e) => set("website", e.target.value)} />
            </Field>
          </div>
          <Field label="Accent colour">
            <input
              type="color"
              value={cv.accent}
              onChange={(e) => set("accent", e.target.value)}
              className="h-9 w-16 cursor-pointer rounded border border-input bg-background p-1"
            />
          </Field>
        </fieldset>

        <fieldset className="card space-y-3 p-4">
          <legend className="px-1 text-sm font-semibold">Summary</legend>
          <textarea className="input" rows={4} value={cv.summary} onChange={(e) => set("summary", e.target.value)} />
        </fieldset>

        <fieldset className="card space-y-4 p-4">
          <legend className="px-1 text-sm font-semibold">Experience</legend>
          {cv.experience.map((e) => (
            <div key={e.id} className="space-y-3 rounded-md border border-border p-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Role">
                  <input className="input" value={e.role} onChange={(ev) => updateExp(e.id, { role: ev.target.value })} />
                </Field>
                <Field label="Company">
                  <input className="input" value={e.company} onChange={(ev) => updateExp(e.id, { company: ev.target.value })} />
                </Field>
                <Field label="Start">
                  <input className="input" value={e.start} onChange={(ev) => updateExp(e.id, { start: ev.target.value })} />
                </Field>
                <Field label="End">
                  <input className="input" value={e.end} onChange={(ev) => updateExp(e.id, { end: ev.target.value })} />
                </Field>
              </div>
              <Field label="Achievements (one per line)">
                <textarea className="input" rows={3} value={e.details} onChange={(ev) => updateExp(e.id, { details: ev.target.value })} />
              </Field>
              <button
                type="button"
                className="btn-ghost h-8 px-2 text-destructive"
                onClick={() => set("experience", cv.experience.filter((x) => x.id !== e.id))}
              >
                <Trash2 className="h-4 w-4" /> Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn-outline"
            onClick={() =>
              set("experience", [...cv.experience, { id: uid(), role: "", company: "", start: "", end: "", details: "" }])
            }
          >
            <Plus className="h-4 w-4" /> Add experience
          </button>
        </fieldset>

        <fieldset className="card space-y-4 p-4">
          <legend className="px-1 text-sm font-semibold">Education</legend>
          {cv.education.map((e) => (
            <div key={e.id} className="space-y-3 rounded-md border border-border p-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Degree">
                  <input className="input" value={e.degree} onChange={(ev) => updateEdu(e.id, { degree: ev.target.value })} />
                </Field>
                <Field label="School">
                  <input className="input" value={e.school} onChange={(ev) => updateEdu(e.id, { school: ev.target.value })} />
                </Field>
                <Field label="Start">
                  <input className="input" value={e.start} onChange={(ev) => updateEdu(e.id, { start: ev.target.value })} />
                </Field>
                <Field label="End">
                  <input className="input" value={e.end} onChange={(ev) => updateEdu(e.id, { end: ev.target.value })} />
                </Field>
              </div>
              <button
                type="button"
                className="btn-ghost h-8 px-2 text-destructive"
                onClick={() => set("education", cv.education.filter((x) => x.id !== e.id))}
              >
                <Trash2 className="h-4 w-4" /> Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn-outline"
            onClick={() => set("education", [...cv.education, { id: uid(), degree: "", school: "", start: "", end: "" }])}
          >
            <Plus className="h-4 w-4" /> Add education
          </button>
        </fieldset>

        <fieldset className="card space-y-3 p-4">
          <legend className="px-1 text-sm font-semibold">Skills</legend>
          <Field label="Comma separated">
            <textarea className="input" rows={2} value={cv.skills} onChange={(e) => set("skills", e.target.value)} />
          </Field>
        </fieldset>
      </div>

      {/* ---------- Live A4 preview ---------- */}
      <div className="min-w-0 overflow-x-auto print:overflow-visible">
        <div
          id="cv-sheet"
          className="mx-auto bg-white text-[#111827] shadow-xl ring-1 ring-black/10"
          style={{ width: "210mm", minHeight: "297mm", padding: "16mm 16mm", fontSize: "10.5pt", lineHeight: 1.45 }}
        >
          <header style={{ borderBottom: `3px solid ${cv.accent}`, paddingBottom: "6mm" }}>
            <h2 style={{ fontSize: "26pt", fontWeight: 800, lineHeight: 1.1 }}>{cv.name || "Your Name"}</h2>
            {cv.title && <p style={{ color: cv.accent, fontSize: "13pt", fontWeight: 600, marginTop: 4 }}>{cv.title}</p>}
            {contact.length > 0 && (
              <p style={{ marginTop: 8, fontSize: "9.5pt", color: "#4b5563" }}>{contact.join("  ·  ")}</p>
            )}
          </header>

          {cv.summary && (
            <Section title="Profile" accent={cv.accent}>
              <p>{cv.summary}</p>
            </Section>
          )}

          {cv.experience.length > 0 && (
            <Section title="Experience" accent={cv.accent}>
              {cv.experience.map((e) => (
                <div key={e.id} style={{ marginBottom: 12, breakInside: "avoid" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, fontWeight: 700 }}>
                    <span>
                      {e.role}
                      {e.company && <span style={{ fontWeight: 500 }}> · {e.company}</span>}
                    </span>
                    <span style={{ fontWeight: 500, color: "#6b7280", whiteSpace: "nowrap" }}>{dates(e.start, e.end)}</span>
                  </div>
                  {lines(e.details).length > 0 && (
                    <ul style={{ listStyle: "disc", paddingLeft: "1.2em", marginTop: 3 }}>
                      {lines(e.details).map((l, i) => (
                        <li key={i}>{l}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </Section>
          )}

          {cv.education.length > 0 && (
            <Section title="Education" accent={cv.accent}>
              {cv.education.map((e) => (
                <div key={e.id} style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 6 }}>
                  <span>
                    <strong>{e.degree}</strong>
                    {e.school && <span> · {e.school}</span>}
                  </span>
                  <span style={{ color: "#6b7280", whiteSpace: "nowrap" }}>{dates(e.start, e.end)}</span>
                </div>
              ))}
            </Section>
          )}

          {skills.length > 0 && (
            <Section title="Skills" accent={cv.accent}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {skills.map((s, i) => (
                  <span
                    key={i}
                    style={{ border: `1px solid ${cv.accent}`, color: cv.accent, borderRadius: 999, padding: "1px 10px", fontSize: "9.5pt" }}
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
  );
}

function Section({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <section style={{ marginTop: "7mm" }}>
      <h3
        style={{
          color: accent,
          fontSize: "10pt",
          fontWeight: 800,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          marginBottom: 6,
        }}
      >
        {title}
      </h3>
      {children}
    </section>
  );
}
