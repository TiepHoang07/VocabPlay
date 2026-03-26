import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { User, LogOut, Award, Calendar, BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { getUserWords } from "../api/words";

export default function Profile() {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    const fetchWordCount = async () => {
      try {
        const res = await getUserWords();
        setWordCount(res.length);
      } catch (error) {
        console.error("Error fetching word count:", error);
      }
    };
    fetchWordCount();
  }, []);

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden">

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
            <div className="w-32 h-32 rounded-full bg-blue-color p-1 shadow-xl shadow-blue-color/20">
              <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center border-4 border-white/5">
                <span className="text-5xl font-black text-blue-color">
                  {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                </span>
              </div>
            </div>

            <div className="flex-1 text-center md:text-left space-y-2">
              <h1 className="text-4xl font-black text-white tracking-tight leading-none">{user.name || "Vocab Player"}</h1>
              <p className="text-slate-400 text-lg flex items-center justify-center md:justify-start gap-2">
                <User className="w-5 h-5 text-blue-color" />
                {user.email}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/50 rounded-xl transition-all flex items-center gap-2 font-medium"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-inner relative overflow-hidden group hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-3 text-blue-color mb-2">
                <Award className="w-5 h-5 transition-transform group-hover:scale-110" />
                <h3 className="font-bold text-lg uppercase tracking-wider">Top Score</h3>
              </div>
              <p className="text-4xl font-black text-white tracking-tight">--</p>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">in Word Chain</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-inner relative overflow-hidden group hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-3 text-green-color mb-2">
                <BookOpen className="w-5 h-5 transition-transform group-hover:scale-110" />
                <h3 className="font-bold text-lg uppercase tracking-wider">Saved Words</h3>
              </div>
              <p className="text-4xl font-black text-white tracking-tight">{wordCount}</p>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">in Dictionary</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-inner relative overflow-hidden group hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-3 text-yellow-color mb-2">
                <Calendar className="w-5 h-5 transition-transform group-hover:scale-110" />
                <h3 className="font-bold text-lg uppercase tracking-wider">Member Since</h3>
              </div>
              <p className="text-2xl font-black text-white tracking-tight mt-2">Recently</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
