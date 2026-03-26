import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { User, LogOut, Award, Calendar, BookOpen, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getUserWords } from "../api/words";
import { changePassword, getMe } from "../api/client";
import toast from "react-hot-toast";

export default function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [wordCount, setWordCount] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [fastestTime, setFastestTime] = useState(0);
  const [createdAt, setCreatedAt] = useState(0);
  const { user, logout, isLoading: authLoading } = useAuthContext();
  const [password, setPassword] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });


  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [wordRes, meRes] = await Promise.all([getUserWords(), getMe()]);
        setWordCount(wordRes.length);
        setHighScore(meRes.highestScore);
        setFastestTime(meRes.fastestTime);
        setCreatedAt(meRes.createdAt);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleChangePassword = async () => {
    try {
      if (!password.currentPassword || !password.newPassword || !password.confirmPassword) {
        toast.error("Please fill in all fields");
        return;
      }
      if (password.newPassword !== password.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      if (password.newPassword.length < 8) {
        toast.error("Password must be at least 8 characters long");
        return;
      }
      await changePassword(password.currentPassword, password.newPassword, password.confirmPassword);
      toast.success("Password changed successfully");
    } catch (error: any) {
      console.error("Error changing password:", error.response.data.error);
      toast.error(error.response.data.error);
    }
  }

  if (authLoading || (user && loading)) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-blue-color" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden">

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
            <div className="w-32 h-32 rounded-full bg-blue-color p-1 shadow-lg shadow-blue-color/20">
              <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center border-4 border-white/5">
                <span className="text-5xl font-black text-blue-color">
                  {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                </span>
              </div>
            </div>

            <div className="flex-1 text-center md:text-left space-y-2">
              <h1 className="text-3xl font-bold text-slate-800 tracking-tight leading-none">{user.name || "Vocab Player"}</h1>
              <p className="text-slate-400 text-lg flex items-center justify-center md:justify-start gap-2">
                <User className="w-5 h-5 text-blue-color" />
                {user.email}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/50 rounded-xl cursor-pointer transition-all flex items-center gap-2 font-medium"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-inner relative overflow-hidden group hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-3 text-blue-color mb-2">
                <Award className="w-5 h-5 transition-transform" />
                <h3 className="font-bold text-lg uppercase tracking-wider">Best Score</h3>
              </div>

              <p className="text-slate-400 text-nowrap text-xs font-bold uppercase tracking-widest mt-1">in Word Chain: <span className="text-[15px] font-semibold text-gray-600 tracking-tight">{highScore}</span></p>
              <p className="text-slate-400 text-nowrap text-xs font-bold uppercase tracking-widest mt-1">in Matching Game: <span className="text-[15px] font-semibold text-gray-600 tracking-tight">{fastestTime}</span></p>

            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-inner relative overflow-hidden group hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-3 text-green-color mb-2">
                <BookOpen className="w-5 h-5 transition-transform" />
                <h3 className="font-bold text-lg uppercase tracking-wider">Saved Words</h3>
              </div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Words In Flip Cards: <span className="text-[15px] font-semibold text-gray-600 tracking-tight">{wordCount}</span></p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-inner relative overflow-hidden group hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-3 text-yellow-color mb-2">
                <Calendar className="w-5 h-5 transition-transform" />
                <h3 className="font-bold text-lg uppercase tracking-wider">Member Since</h3>
              </div>
              <p className="text-[15px] font-semibold text-gray-600 tracking-tight mt-2 text-center">{new Date(createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="space-y-4 mt-4 p-4">
            <h3 className="text-blue-color text-2xl font-bold">Change Password</h3>
            <div className="flex flex-col space-y-4">
              <label className="text-dark-blue-color text-md font-semibold">Your Current Password <span className="text-red-500">*</span></label>
              <input value={password.currentPassword} onChange={(e) => setPassword({ ...password, currentPassword: e.target.value })} className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 bg-white/5 focus:border-blue-color" type="password" placeholder="Current Password" />

              <label className="text-dark-blue-color text-md font-semibold">Your New Password <span className="text-red-500">*</span></label>
              <input value={password.newPassword} onChange={(e) => setPassword({ ...password, newPassword: e.target.value })} className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 bg-white/5 focus:border-blue-color" type="password" placeholder="New Password" />

              <label className="text-dark-blue-color text-md font-semibold">Confirm New Password <span className="text-red-500">*</span></label>
              <input value={password.confirmPassword} onChange={(e) => setPassword({ ...password, confirmPassword: e.target.value })} className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 bg-white/5 focus:border-blue-color" type="password" placeholder="Confirm New Password" />

              <button onClick={handleChangePassword} className="w-full px-4 py-4 rounded-xl bg-blue-color text-white font-bold hover:bg-dark-blue-color cursor-pointer transition-all">Change Password</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
