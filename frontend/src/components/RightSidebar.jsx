import React from 'react';
import { useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Link } from 'react-router-dom';
import SuggestedUsers from './SuggestedUsers';
import { Activity, TrendingUp, Zap, BarChart3, Clock } from 'lucide-react';

const RightSidebar = () => {
  const { user } = useSelector(state => state.auth);
  const { posts } = useSelector(state => state.post);

  // Real Data Science Metrics Computation
  const userPosts = posts?.filter(p => p.author?._id === user?._id || p.author === user?._id) || [];
  
  // Predict Optimal Posting Window
  let optimalTime = null;
  if (userPosts.length > 0) {
      const hours = userPosts.map(p => new Date(p.createdAt).getHours());
      const hourCounts = hours.reduce((acc, hour) => {
          acc[hour] = (acc[hour] || 0) + 1;
          return acc;
      }, {});
      const bestHour = Object.keys(hourCounts).reduce((a, b) => hourCounts[a] > hourCounts[b] ? a : b);
      const nextHour = (parseInt(bestHour) + 1) % 24;
      optimalTime = `${bestHour.toString().padStart(2, '0')}:00 - ${nextHour.toString().padStart(2, '0')}:00`;
  }

  // Identify Top Skill
  const topSkill = user?.skills?.[0] || 'Professional Insight';


  return (
    <div 
      className="
        flex flex-col 
        gap-6 
        w-80
        mt-6
        sticky top-6
      "
    >
      {/* Profile Summary Card */}
      <div className="glass-card p-6 flex items-center gap-4 w-full">
        <Link to={`/profile/${user?._id}`} className="cursor-pointer shrink-0">
          <Avatar className="h-12 w-12 rounded-xl border border-white/20 shadow-sm overflow-hidden">
            <AvatarImage src={user?.profilepicture || "https://github.com/shadcn.png"} className="w-full h-full object-cover" />
            <AvatarFallback className="bg-indigo-50 text-indigo-700 font-bold">{user?.username?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex flex-col justify-center items-start min-w-0">
          <span className="font-black text-slate-900 text-sm truncate hover:text-indigo-600 transition-colors">
            <Link to={`/profile/${user?._id}`}>{user?.username}</Link>
          </span>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest truncate max-w-[150px]">
            {user?.bio || "Professional Hub"}
          </span>
        </div>
      </div>

      {/* Machine Learning Analytics CTA */}
      <div className="glass-card p-6 flex flex-col gap-4 relative overflow-hidden group">
        <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <Activity className="h-32 w-32 text-indigo-600" />
        </div>
        
        <div className="flex items-center gap-3 mb-2 border-b border-slate-100 pb-4 relative z-10">
          <Activity className="h-5 w-5 text-indigo-600" />
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Network Intelligence</h3>
        </div>
        
        <p className="text-xs text-slate-500 font-medium leading-relaxed relative z-10">
          Unlock your complete data-driven career influence report powered by our ML pipeline.
        </p>
        
        <Link 
          to="/analytics" 
          className="w-full text-center py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[11px] uppercase tracking-widest rounded-xl transition-colors relative z-10"
        >
          View Full Analytics
        </Link>
      </div>

      {/* Predictive Post Suggestion */}
      {optimalTime && (
          <div className="glass-card p-6 flex flex-col gap-3 relative overflow-hidden border border-indigo-50 shadow-md">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="h-4 w-4 text-amber-500 animate-pulse" />
              <h3 className="text-xs font-black uppercase tracking-[0.15em] text-slate-900 border-b border-indigo-50 pb-2 w-full">AI Suggestion</h3>
            </div>
            
            <p className="text-sm text-slate-700 font-medium leading-relaxed italic">
              To maximize network influence, draft a transmission regarding <span className="font-bold text-indigo-600">'{topSkill}'</span> tomorrow between <span className="font-bold text-indigo-600">{optimalTime}</span>.
            </p>
          </div>
      )}

      <div className="glass-card p-6">
        <SuggestedUsers />
      </div>
    </div>
  );
};

export default RightSidebar;

