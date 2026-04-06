import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import useGetUserProfile from '@/hooks/useGetUserProfile';
import { Button } from './ui/button';
import { ArrowLeft, Download, MapPin, Mail, Briefcase, Award, Zap, LayoutDashboard, Sparkles } from 'lucide-react';
import useAxiosInterceptor from '@/hooks/useAxiosInterceptor';

const ResumeGenerator = () => {
    useAxiosInterceptor();
    const params = useParams();
    const navigate = useNavigate();
    useGetUserProfile(params.id);
    const { userProfile } = useSelector(state => state.auth);

    useEffect(() => {
        // We could auto-print, but a button is better UX
    }, []);

    if (!userProfile) return <div className="p-10 text-center">Loading Data Profile...</div>;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-slate-100 py-10 print:bg-white print:py-0">
            {/* Top Bar - Hidden in Print */}
            <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center px-4 print:hidden">
                <Button variant="outline" onClick={() => navigate(-1)} className="gap-2 rounded-xl border-white shadow-sm hover:bg-white bg-white/50 backdrop-blur-md">
                    <ArrowLeft className="h-4 w-4" /> Back to Network
                </Button>
                <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest hidden sm:block">Zocial Professional Engine</span>
                    <Button onClick={handlePrint} className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg hover:shadow-indigo-200/50 transition-all font-bold">
                        <Download className="h-4 w-4" /> Export as PDF Resume
                    </Button>
                </div>
            </div>

            {/* A4 Paper Canvas */}
            <div className="max-w-4xl mx-auto bg-white shadow-2xl print:shadow-none min-h-[1056px] p-12 sm:p-20 relative overflow-hidden">
                
                {/* Background Decor */}
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 border-b-2 border-slate-100 pb-10 mb-10 relative z-10">
                    <div className="h-32 w-32 rounded-3xl overflow-hidden shrink-0 shadow-lg border-4 border-white">
                        <img 
                            src={userProfile.profilepicture || "https://github.com/shadcn.png"} 
                            alt={userProfile.username}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-2 uppercase">{userProfile.username}</h1>
                        <h2 className="text-lg sm:text-xl font-black text-indigo-600 tracking-widest uppercase mb-4">{userProfile.bio || "Zocial Network Professional"}</h2>
                        <div className="flex flex-wrap items-center gap-6 text-slate-500 text-xs sm:text-sm font-bold uppercase tracking-wider">
                            <span className="flex items-center gap-2"><Mail className="h-4 w-4 text-slate-400"/> {userProfile.email || "Contact via Zocial"}</span>
                            <span className="flex items-center gap-2"><Briefcase className="h-4 w-4 text-slate-400"/> {userProfile.posts?.length || 0} Transmissions</span>
                        </div>
                    </div>
                </div>

                {/* Main Content Split */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 relative z-10">
                    
                    {/* Left Column (Skills & Data) */}
                    <div className="md:col-span-4 flex flex-col gap-12">
                        <div>
                            <h3 className="text-[11px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                <Zap className="h-4 w-4" /> AI Identified Skills
                            </h3>
                            <div className="flex flex-col gap-4">
                                {userProfile.skills && userProfile.skills.length > 0 ? (
                                    userProfile.skills.map((skill, index) => (
                                        <div key={index} className="flex flex-col gap-1.5">
                                            <div className="flex justify-between items-center w-full">
                                                <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">{skill}</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-indigo-500 rounded-full" style={{width: `${Math.max(40, 100 - (index * 15))}%`}}></div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <span className="text-xs text-slate-400 font-medium leading-relaxed">No skills generated by NLP engine yet. Post technical content to generate a skill graph.</span>
                                )}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                <Award className="h-4 w-4" /> Influence Metrics
                            </h3>
                            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col gap-5">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Network Reach</span>
                                    <span className="text-2xl font-black text-slate-900">{userProfile.followers?.length || 0}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Managed Connections</span>
                                    <span className="text-2xl font-black text-slate-900">{userProfile.following?.length || 0}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Experience/Posts) */}
                    <div className="md:col-span-8 flex flex-col gap-8 md:border-l-2 md:border-slate-50 md:pl-12 md:-ml-6 relative">
                        {/* AI Career Summary (Real AI) */}
                        {userProfile.ai_summary && (
                            <div className="mb-4">
                                <h3 className="text-[11px] font-black text-indigo-500 uppercase tracking-[0.2em] flex items-center gap-2 mb-4">
                                    <Sparkles className="h-4 w-4" /> AI Career Overview
                                </h3>
                                <div className="bg-indigo-50/50 rounded-2xl p-6 border border-indigo-100/50 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-2 opacity-10">
                                        <Sparkles className="h-10 w-10 text-indigo-600" />
                                    </div>
                                    <p className="text-sm text-slate-700 font-medium leading-relaxed relative z-10">
                                        {userProfile.ai_summary}
                                    </p>
                                </div>
                            </div>
                        )}

                        <h3 className="text-[11px] font-black text-blue-500 uppercase tracking-[0.2em] flex items-center gap-2 mb-2">
                            <LayoutDashboard className="h-4 w-4" /> Professional Portfolio
                        </h3>
                        
                        <div className="flex flex-col gap-10">
                            {userProfile.posts && userProfile.posts.slice(0, 3).map((post, i) => (
                                <div key={post._id} className="relative">
                                    <div className="hidden md:block absolute -left-[57px] top-1.5 h-4 w-4 bg-white border-4 border-slate-200 rounded-full shadow-sm"></div>
                                    <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] mb-1">Key Insight {i + 1}</h4>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block">{new Date(post.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                    
                                    <div className="flex flex-col sm:flex-row gap-5 items-start">
                                        {post.image && (
                                            <div className="h-28 w-28 rounded-xl overflow-hidden shrink-0 border border-slate-100 shadow-sm relative group">
                                                <img src={post.image} className="w-full h-full object-cover grayscale opacity-90 transition-all duration-500" alt="Portfolio Data" />
                                            </div>
                                        )}
                                        <p className="text-sm text-slate-600 font-medium leading-relaxed italic border-l-4 border-indigo-100 pl-5 py-2">
                                            "{post.caption}"
                                        </p>
                                    </div>
                                    
                                    <div className="flex gap-6 mt-5 pt-5 border-t border-slate-50">
                                        <span className="text-[10px] font-black tracking-widest uppercase text-slate-400">{post.likes?.length || 0} Peer Endorsements</span>
                                        <span className="text-[10px] font-black tracking-widest uppercase text-slate-400">{post.comments?.length || 0} Collaboration Replies</span>
                                    </div>
                                </div>
                            ))}
                            
                            {(!userProfile.posts || userProfile.posts.length === 0) && (
                                    <span className="text-sm text-slate-400 font-medium">No professional transmissions logged to build portfolio from.</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            
            <style jsx="true" global="true">{`
                @media print {
                    @page { size: auto;  margin: 0mm; }
                    body {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                        background: white !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default ResumeGenerator;
