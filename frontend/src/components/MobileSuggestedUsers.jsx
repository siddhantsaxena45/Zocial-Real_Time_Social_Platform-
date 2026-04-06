import React from 'react';
import { useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

const MobileSuggestedUsers = () => {
    const { suggestedUsers, user: currentUser } = useSelector(state => state.auth);

    const finalSuggestions = suggestedUsers
        .filter(u => !currentUser?.following?.includes(u._id))
        .slice(0, 8);

    if (finalSuggestions.length === 0) return null;

    return (
        <div className="lg:hidden mt-4 mb-8">
            <div className="flex items-center gap-2 mb-4 px-1">
                <Sparkles className="h-4 w-4 text-indigo-600" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Collaborators for you</span>
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 mask-fade-right">
                {finalSuggestions.map(user => (
                    <div 
                        key={user._id} 
                        className="flex flex-col items-center justify-between p-5 rounded-2xl bg-white border border-slate-100 shadow-sm min-w-[140px] text-center group active:scale-95 transition-all duration-300"
                    >
                        <Link to={`/profile/${user?._id}`} className="mb-3">
                            <Avatar className="h-16 w-16 rounded-2xl border-2 border-indigo-50 shadow-sm overflow-hidden transition-transform group-hover:scale-110">
                                <AvatarImage src={user?.profilepicture || "https://github.com/shadcn.png"} className="w-full h-full object-cover" />
                                <AvatarFallback className="bg-slate-100 text-slate-500 font-bold">CN</AvatarFallback>
                            </Avatar>
                        </Link>
                        
                        <div className="flex flex-col gap-0.5 mb-4">
                            <span className="font-black text-xs text-slate-900 truncate w-32 tracking-tight group-hover:text-indigo-600 transition-colors">
                                {user?.username}
                            </span>
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest truncate w-32">
                                {user?.bio?.split(' ')[0] || "Network"}
                            </span>
                        </div>

                        <Link 
                            to={`/profile/${user?._id}`}
                            className="w-full py-2 rounded-xl bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all"
                        >
                            Focus
                        </Link>
                    </div>
                ))}
            </div>
            
            <style jsx="true">{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                .mask-fade-right {
                    mask-image: linear-gradient(to right, black 85%, transparent 100%);
                }
            `}</style>
        </div>
    );
};

export default MobileSuggestedUsers;
