import { Link } from "react-router-dom";

const Home = () => (
  <>
    {/* Hero: ruled-paper background ties directly to the notes/DPP identity */}
    <section className="bg-ruled-paper">
      <div className="max-w-6xl mx-auto px-6 pt-20 pb-24">
        <span className="font-mono text-xs uppercase tracking-widest text-rust">
          Nursing made simple
        </span>
        <h1 className="font-display text-5xl sm:text-6xl font-semibold leading-[1.05] mt-4 max-w-3xl">
          Live classes, notes and DPPs —
          <span className="text-marigold"> built for nursing students.</span>
        </h1>
        <p className="text-lg text-ink/70 mt-6 max-w-xl">
          Nursita brings your faculty's live class, the recording, the day's notes and practice
          problems together — so revising Anatomy, Pharmacology or Med-Surg is one tab, not five.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            to="/courses"
            className="px-6 py-3 rounded-lg bg-ink text-paper font-medium hover:bg-marigold hover:text-ink transition-colors"
          >
            Browse courses
          </Link>
          <Link
            to="/register"
            className="px-6 py-3 rounded-lg border border-ink font-medium hover:bg-white transition-colors"
          >
            Create free account
          </Link>
        </div>
      </div>
    </section>

    {/* How it works — sequence, so numbering is earned here */}
    <section className="max-w-6xl mx-auto px-6 py-20">
      <h2 className="font-display text-3xl font-semibold mb-10">How a class day works</h2>
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
          <div key={step.n} className="margin-rule">
            <span className="font-mono text-sm text-rust">{step.n}</span>
            <h3 className="font-display text-xl font-semibold mt-2">{step.title}</h3>
            <p className="text-ink/60 mt-2 text-sm leading-relaxed">{step.copy}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Founder */}
    <section className="max-w-6xl mx-auto px-6 pb-24">
      <div className="rounded-2xl border border-rule bg-white p-8 sm:p-10 flex flex-col sm:flex-row gap-8 items-start sm:items-center">
        <div className="w-20 h-20 rounded-full bg-ink flex items-center justify-center shrink-0">
          <span className="font-display text-2xl font-semibold text-marigold">VR</span>
        </div>
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-teal">
            Founder &amp; Lead Instructor
          </span>
          <h2 className="font-display text-2xl font-semibold mt-1">Vineeta Rani</h2>
          <p className="text-ink/60 mt-2 max-w-xl text-sm leading-relaxed">
            Vineeta started Nursita on a simple idea: a nursing student revising at 11pm
            shouldn't need five different apps to find today's class, its notes and the practice
            problems that go with it. She teaches live on the platform every week.
          </p>
        </div>
      </div>
    </section>
  </>
);

export default Home;
