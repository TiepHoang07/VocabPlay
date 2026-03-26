import { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { Medal, Timer, Split, Star, User as UserIcon, Loader2 } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import {
    getWordChainLeaderboard,
    getMatchingGameLeaderboard,
    getWordChainHighScore,
    getMatchingGameFastestTime
} from '../api/gameScores';

interface LeaderboardEntry {
    id: string;
    name: string;
    avatarUrl: string;
    highestScore?: number;
    fastestTime?: number;
}

export default function Leaderboard() {
    const { isSignedIn, isLoaded } = useAuth();
    const { user } = useUser();
    const { authRequest } = useApi();
    const [activeTab, setActiveTab] = useState<'wordChain' | 'matchingGame'>('wordChain');
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<LeaderboardEntry[]>([]);
    const [myBest, setMyBest] = useState<{ score: number; time: number }>({ score: 0, time: 0 });

    useEffect(() => {
        const fetchData = async () => {
            if (!isLoaded) return;
            setLoading(true);
            try {
                if (activeTab === 'wordChain') {
                    const res = await getWordChainLeaderboard(authRequest);
                    setData(res);
                } else {
                    const res = await getMatchingGameLeaderboard(authRequest);
                    setData(res);
                }

                if (isSignedIn) {
                    const scoreRes = await getWordChainHighScore(authRequest);
                    const timeRes = await getMatchingGameFastestTime(authRequest);
                    setMyBest({
                        score: scoreRes?.highestScore || 0,
                        time: timeRes?.fastestTime || 0
                    });
                }
            } catch (error) {
                console.error("Error fetching leaderboard:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [activeTab, isSignedIn, isLoaded, authRequest]);

    if (!isLoaded) return null;

    const formatTime = (seconds: number) => {
        if (seconds === 0) return "--:--";
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header section */}
            <div className="flex flex-col items-center justify-center space-y-4">
                <img className='w-88 h-50 border-b-4 border-b-yellow-color' src="penguin_leaderboard.webp" alt="Penguin Leaderboard" />
                <h1 className="text-4xl font-black text-gray-900 tracking-tight">Leaderboard</h1>
                <p className="text-gray-500 text-lg max-w-lg mx-auto text-center">
                    Celebrate the top vocabulary masters in our community. Are you on the list?
                </p>
            </div>

            {/* Stats Summary for User */}
            {isSignedIn && (
                <div className="grid grid-cols-2 gap-2 md:gap-4">
                    <div className="bg-blue-color/5 border-2 border-blue-color/10 rounded-3xl p-3 md:p-6 flex items-center gap-4 transition-all hover:border-blue-color/30 group">
                        <div className="w-12 h-12 bg-blue-color rounded-2xl flex items-center justify-center shadow-lg shadow-blue-color/20 group-hover:scale-110 transition-transform">
                            <Split className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <div className="text-xs font-black text-blue-color uppercase tracking-widest mb-0.5">My Best Chain</div>
                            <div className="text-xl md:text-2xl font-black text-gray-900">{myBest.score} words</div>
                        </div>
                    </div>
                    <div className="bg-green-color/5 border-2 border-green-color/10 rounded-3xl p-3 md:p-6 flex items-center gap-4 transition-all hover:border-green-color/30 group">
                        <div className="w-12 h-12 bg-green-color rounded-2xl flex items-center justify-center shadow-lg shadow-green-color/20 group-hover:scale-110 transition-transform">
                            <Timer className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <div className="text-xs font-black text-green-color uppercase tracking-widest mb-0.5">My Fastest Match</div>
                            <div className="text-xl md:text-2xl font-black text-gray-900">{formatTime(myBest.time)}</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Tab Switcher */}
            <div className="flex p-1.5 bg-gray-100/50 rounded-2xl max-w-md mx-auto relative overflow-hidden">
                <button
                    onClick={() => setActiveTab('wordChain')}
                    className={`relative cursor-pointer z-10 flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${activeTab === 'wordChain' ? 'bg-white text-blue-color shadow-sm' : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <Split className="h-4 w-4" />
                    Word Chain
                </button>
                <button
                    onClick={() => setActiveTab('matchingGame')}
                    className={`relative cursor-pointer z-10 flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${activeTab === 'matchingGame' ? 'bg-white text-green-color shadow-sm' : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <Timer className="h-4 w-4" />
                    Memory Match
                </button>
            </div>

            {/* Leaderboard List */}
            <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden relative min-h-[400px]">
                {loading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-20">
                        <Loader2 className="h-10 w-10 text-gray-300 animate-spin" />
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {data.length > 0 ? (
                            data.map((entry, index) => (
                                <div
                                    key={entry.id}
                                    className={`flex items-center gap-4 p-5 transition-all hover:bg-gray-50/50 ${entry.id === user?.id ? 'bg-yellow-color/5' : ''
                                        }`}
                                >
                                    {/* Rank Badge */}
                                    <div className="w-10 text-center">
                                        {index === 0 ? (
                                            <div className="inline-flex items-center justify-center w-8 h-8 bg-yellow-color text-white rounded-lg shadow-lg shadow-yellow-color/30 font-black">1</div>
                                        ) : index === 1 ? (
                                            <div className="inline-flex items-center justify-center w-8 h-8 bg-slate-300 text-white rounded-lg shadow-lg shadow-slate-300/30 font-black">2</div>
                                        ) : index === 2 ? (
                                            <div className="inline-flex items-center justify-center w-8 h-8 bg-amber-600/60 text-white rounded-lg shadow-lg shadow-amber-600/20 font-black">3</div>
                                        ) : (
                                            <span className="text-gray-400 font-bold text-lg">#{index + 1}</span>
                                        )}
                                    </div>

                                    {/* User Avatar */}
                                    <div className="w-12 h-12 rounded-2xl bg-gray-100 overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
                                        {entry.avatarUrl ? (
                                            <img src={entry.avatarUrl} alt={entry.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                <UserIcon className="h-6 w-6" />
                                            </div>
                                        )}
                                    </div>

                                    {/* User Info */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-gray-900 truncate flex items-center gap-2">
                                            {entry.name || 'Anonymous Explorer'}
                                            {entry.id === user?.id && (
                                                <span className="text-[10px] bg-yellow-color/20 text-yellow-color px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">You</span>
                                            )}
                                        </h3>
                                        <p className="text-xs text-gray-400 font-medium">Ranked player</p>
                                    </div>

                                    {/* Score */}
                                    <div className="text-right flex-shrink-0">
                                        <div className={`text-xl font-black ${activeTab === 'wordChain' ? 'text-blue-color' : 'text-green-color'}`}>
                                            {activeTab === 'wordChain' ? `${entry.highestScore} words` : formatTime(entry.fastestTime || 0)}
                                        </div>
                                        {index < 3 && (
                                            <div className="flex justify-end gap-0.5 mt-1">
                                                {[...Array(3 - index)].map((_, i) => (
                                                    <Star key={i} className="h-3 w-3 fill-yellow-color text-yellow-color" />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-20 text-center space-y-4">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                                    <Medal className="h-10 w-10 text-gray-200" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">No champions yet</h3>
                                    <p className="text-gray-500">Be the first to claim the top spot!</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Call to Action */}
            {!isSignedIn && (
                <div className="bg-gray-900 rounded-3xl p-10 text-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-color/20 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-blue-color/30 transition-all duration-700"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-color/10 rounded-full -ml-32 -mb-32 blur-3xl group-hover:bg-yellow-color/20 transition-all duration-700"></div>

                    <h2 className="text-2xl font-black text-white relative z-10 mb-4">Want to see your name here?</h2>
                    <p className="text-gray-400 relative z-10 mb-8 max-w-md mx-auto font-medium">
                        Sign in now to start tracking your progress and compete with vocabulary lovers worldwide.
                    </p>
                    <div className="relative z-10">
                        <button className="bg-white text-gray-900 px-8 py-3.5 rounded-2xl font-black hover:scale-105 transition-all shadow-xl shadow-white/5 active:scale-95">
                            Get Started for Free
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}