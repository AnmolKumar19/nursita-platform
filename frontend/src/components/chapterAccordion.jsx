import { useState } from "react";
import { Link } from "react-router-dom";

const ChapterAccordion = ({
  chapter,
  classes,
  notes,
  isCourseOwner,
  onDeleteClass,
  onDeleteNote,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Filter items belonging to this chapter
  const chapterClasses = classes.filter((c) => String(c.chapter) === String(chapter._id));
  const chapterNotes = notes.filter((n) => n.type === "note" && String(n.chapter) === String(chapter._id));
  const chapterDpps = notes.filter((n) => n.type === "dpp" && String(n.chapter) === String(chapter._id));

  return (
    <div className="border border-slate-200/80 rounded-2xl bg-white mb-4 overflow-hidden shadow-sm transition-all">
      {/* Accordion Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between bg-slate-50/80 hover:bg-slate-100/80 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-600 font-bold text-sm flex items-center justify-center border border-teal-500/20">
            {chapter.order || "•"}
          </span>
          <div>
            <h3 className="font-bold text-slate-900 text-base md:text-lg">{chapter.title}</h3>
            {chapter.description && (
              <p className="text-xs text-slate-500 mt-0.5">{chapter.description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs font-semibold px-3 py-1 bg-slate-200/70 text-slate-700 rounded-full hidden sm:inline-block">
            {chapterClasses.length} Lectures • {chapterNotes.length} Notes • {chapterDpps.length} DPPs
          </span>
          <svg
            className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Accordion Body */}
      {isOpen && (
        <div className="p-6 space-y-6 border-t border-slate-200/80 bg-white">
          {/* LECTURES SECTION */}
          <div>
            <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3">
              Lectures ({chapterClasses.length})
            </h4>
            {chapterClasses.length === 0 ? (
              <p className="text-sm text-slate-400 italic">No lectures uploaded for this chapter.</p>
            ) : (
              <div className="grid gap-2">
                {chapterClasses.map((c) => (
                  <div
                    key={c._id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 transition-colors"
                  >
                    <Link to={`/classes/${c._id}`} className="font-semibold text-slate-800 text-sm hover:text-teal-600">
                      {c.title}
                    </Link>
                    <div className="flex items-center gap-3">
                      <Link
                        to={`/classes/${c._id}`}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                      >
                        Watch →
                      </Link>
                      {isCourseOwner && (
                        <button
                          onClick={() => onDeleteClass(c._id)}
                          className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* NOTES & DPPs SECTION */}
          <div>
            <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3">
              Notes & DPPs ({chapterNotes.length + chapterDpps.length})
            </h4>
            {chapterNotes.length === 0 && chapterDpps.length === 0 ? (
              <p className="text-sm text-slate-400 italic">No study material attached to this chapter.</p>
            ) : (
              <div className="grid gap-2">
                {[...chapterNotes, ...chapterDpps].map((n) => (
                  <div
                    key={n._id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                        n.type === "dpp" ? "bg-indigo-100 text-indigo-700" : "bg-rose-100 text-rose-700"
                      }`}>
                        {n.type}
                      </span>
                      <span className="font-medium text-slate-800 text-sm">{n.title}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <a
                        href={n.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-200 text-slate-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                      >
                        Open File
                      </a>
                      {isCourseOwner && (
                        <button
                          onClick={() => onDeleteNote(n._id)}
                          className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChapterAccordion;