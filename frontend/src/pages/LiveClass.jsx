import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios.js";

const LiveClass = () => {
  const { id } = useParams();
  const [liveClass, setLiveClass] = useState(null);

  useEffect(() => {
    api.get(`/classes/${id}`).then((res) => setLiveClass(res.data));
  }, [id]);

  if (!liveClass) return <p className="max-w-6xl mx-auto px-6 py-16 text-ink/50">Loading…</p>;

  return (
    <div 
      className="max-w-5xl mx-auto px-6 py-16"
      onContextMenu={(e) => e.preventDefault()}
    >
      <Link to={`/courses/${liveClass.course._id}`} className="text-sm text-ink/50 hover:text-marigold">
        ← Back to {liveClass.course.title}
      </Link>

      <div className="flex items-center gap-3 mt-4">
        <h1 className="font-display text-3xl font-semibold">{liveClass.title}</h1>
        <span
          className={`text-xs font-mono px-3 py-1 rounded-full ${
            liveClass.status === "live"
              ? "bg-teal/10 text-teal"
              : liveClass.status === "ended"
              ? "bg-ink/5 text-ink/60"
              : "bg-marigold/15 text-marigold"
          }`}
        >
          {liveClass.status === "live" ? "● Live now" : liveClass.status === "ended" ? "Recording" : "Scheduled"}
        </span>
      </div>
      
      <p className="text-ink/60 mt-2">{liveClass.description}</p>

      {/* Secure Video Player Container */}
      <div className="relative mt-8 w-full aspect-video rounded-2xl overflow-hidden border border-rule bg-black pointer-events-none">
        
        {/* The invisible shield blocking the top 70px (Share button & Title) */}
        <div className="absolute top-0 left-0 w-full h-[70px] bg-transparent z-10 pointer-events-auto"></div>

        {/* The actual YouTube embed */}
        <iframe
          className="w-full h-full pointer-events-auto"
          src={`https://www.youtube.com/embed/${liveClass.youtubeVideoId}?modestbranding=1&rel=0`}
          title={liveClass.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {liveClass.status === "scheduled" && (
        <p className="text-sm text-ink/50 mt-4">
          This class hasn't started yet — scheduled for {new Date(liveClass.scheduledAt).toLocaleString()}.
        </p>
      )}
    </div>
  );
};

export default LiveClass;