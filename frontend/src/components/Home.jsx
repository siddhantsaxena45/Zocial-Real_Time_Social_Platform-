import React from 'react'
import { Outlet } from 'react-router-dom'
import Feed from './Feed'
import RightSidebar from './RightSidebar'
import useGetAllPost from '@/hooks/useGetAllPost'
import useGetSuggestedUsers from '@/hooks/useGetSuggestedUsers'
import { LayoutDashboard, TrendingUp, Zap, Users, Award } from 'lucide-react'
import { useSelector } from 'react-redux'
import MobileSuggestedUsers from './MobileSuggestedUsers'

const Home = () => {
  useGetAllPost();
  useGetSuggestedUsers();
  const { user } = useSelector(state => state.auth);
  const { posts } = useSelector(state => state.post);

  return (
    <div className='flex justify-center gap-8 px-4 lg:px-8 max-w-6xl mx-auto'>
      <div className='w-full max-w-2xl'>
        {/* Network Intelligence Header */}
        <div className="glass-card p-8 mb-10 mt-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <LayoutDashboard className="h-32 w-32 text-indigo-600" />
            </div>
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                    <div className="h-2 w-2 rounded-full bg-indigo-600 animate-ping"></div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">Network Intelligence Active</span>
                </div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
                    Welcome back, <span className="text-gradient">{user?.username}</span>
                </h2>
                {posts?.length === 0 && (user?.followers?.length || 0) === 0 ? (
                  <div className="flex flex-col gap-1 mt-2">
                    <p className="text-slate-500 text-sm font-medium leading-relaxed">
                      Your professional identity is currently in <span className="text-indigo-600 font-bold italic">Neural Initialization</span> mode.
                    </p>
                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Awaiting network signals to calculate influence.</p>
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm font-medium max-w-md leading-relaxed mt-2">
                      Based on your professional network activity, your influence score is currently <span className="text-indigo-600 font-bold">{Math.min(99, Math.round(((user?.followers?.length || 0) * 5 + posts?.length || 0) / 3))}</span> this week.
                  </p>
                )}
                
                <div className="grid grid-cols-3 gap-4 mt-8">
                    {[
                        { 
                          label: 'Engagements', 
                          value: Array.isArray(posts) ? posts.filter(p => p.author?._id === user?._id || p.author === user?._id).reduce((acc, p) => acc + (p.likes?.length || 0) + (p.comments?.length || 0), 0) : 0, 
                          icon: <Zap className="h-4 w-4" />, 
                          color: 'indigo' 
                        },
                        { 
                          label: 'Network', 
                          value: (user?.followers?.length || 0) + (user?.following?.length || 0), 
                          icon: <Users className="h-4 w-4" />, 
                          color: 'purple' 
                        },
                        { 
                          label: 'Influence', 
                          value: (user?.followers?.length || 0) === 0 && posts?.length === 0 ? "0/100" : `${Math.min(99, Math.max(1, Math.round(((user?.followers?.length || 0) * 10 + (posts?.length || 0) * 2) / 3)))}/100`, 
                          icon: <Award className="h-4 w-4" />, 
                          color: 'emerald' 
                        }
                    ].map((stat, i) => (
                        <div key={i} className={`p-4 rounded-2xl bg-${stat.color}-50/50 border border-${stat.color}-100/50 hover:bg-${stat.color}-50 transition-colors`}>
                            <div className={`text-${stat.color}-600 mb-2`}>{stat.icon}</div>
                            <div className="text-xl font-black text-slate-900">{stat.value}</div>
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Mobile-Only Horizontal Suggestions */}
        <MobileSuggestedUsers />

        <Feed />
        <Outlet />
      </div>
      <div className='hidden xl:block w-80 shrink-0'>
        <div className="sticky top-6">
            <RightSidebar />
        </div>
      </div>
    </div>
  )
}


export default Home
