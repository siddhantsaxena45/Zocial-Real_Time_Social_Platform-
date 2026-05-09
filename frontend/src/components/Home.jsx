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
        {/* Welcome Header */}
        <div className="mb-6 mt-6">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Welcome back, <span className="text-indigo-600">{user?.username}</span>
            </h2>
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
