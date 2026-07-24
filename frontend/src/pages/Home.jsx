import { Link } from "react-router-dom";

const Home = () => (
  <div className="bg-slate-50 text-slate-800 min-h-screen">
    {/* Hero Section with Warm Accent Colors */}
    <section className="bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-20">
        <span className="font-mono text-xs uppercase tracking-widest text-amber-600 font-bold">
          Nursing made simple
        </span>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 leading-[1.1] mt-4 max-w-3xl tracking-tight">
          Live classes, notes and DPPs —
          <span className="text-amber-500"> built for nursing students.</span>
        </h1>
        <p className="text-base sm:text-lg text-slate-600 mt-6 max-w-xl leading-relaxed">
          Nursita brings your faculty's live class, the recording, the day's notes and practice
          problems together — so revising Anatomy, Pharmacology or Med-Surg is one tab, not five.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            to="/courses"
            className="px-6 py-3 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all shadow-md"
          >
            Browse courses
          </Link>
          <Link
            to="/register"
            className="px-6 py-3 rounded-xl border border-slate-300 bg-white text-slate-800 font-bold text-sm hover:bg-slate-100 transition-all"
          >
            Create free account
          </Link>
        </div>
      </div>
    </section>

    {/* How it works */}
    <section className="max-w-6xl mx-auto px-6 py-16">
      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-10">
        How a class day works
      </h2>
      <div className="grid sm:grid-cols-3 gap-8">
        {[
          {
            n: "01",
            title: "Join the live class",
            copy: "Watch your teacher live, right inside the course page — no separate app.",
          },
          {
            n: "02",
            title: "Miss it? Watch the recording",
            copy: "Every live class turns into a recording automatically, same page, same link.",
          },
          {
            n: "03",
            title: "Revise with notes & DPP",
            copy: "Download the day's notes and Daily Practice Problems right after class.",
          },
        ].map((step) => (
          <div
            key={step.n}
            className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all"
          >
            <span className="font-mono text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-full">
              {step.n}
            </span>
            <h3 className="text-lg font-bold text-slate-900 mt-4">{step.title}</h3>
            <p className="text-slate-500 mt-2 text-sm leading-relaxed">{step.copy}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Founder Section */}
    <section className="max-w-6xl mx-auto px-6 pb-20">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-10 flex flex-col sm:flex-row gap-8 items-start sm:items-center shadow-sm">
        <div className="w-20 h-20 rounded-full bg-slate-950 flex items-center justify-center shrink-0 shadow-md">
          <span className="text-2xl font-black text-amber-400">VR</span>
        </div>
        <div>
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-amber-600">
            Founder &amp; Lead Instructor
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-1">Vineeta Rani</h2>
          <p className="text-slate-600 mt-2 max-w-xl text-sm leading-relaxed">
            Vineeta started Nursita on a simple idea: a nursing student revising at 11pm
            shouldn't need five different apps to find today's class, its notes and the practice
            problems that go with it. She teaches live on the platform every week.
          </p>
        </div>
      </div>
    </section>
  </div>
);

export default Home;