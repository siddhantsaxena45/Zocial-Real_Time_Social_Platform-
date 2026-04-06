import React, { useEffect, useState } from 'react';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    BarChart, Bar, Cell
} from 'recharts';
import axios from 'axios';
import { toast } from 'sonner';
import { LayoutDashboard, TrendingUp, Users, Award, Briefcase, Zap, Activity, Download } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const AnalyticsDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchAnalytics = async (forceRefresh = false) => {
        try {
            if (forceRefresh) setLoading(true);
            const url = `${import.meta.env.VITE_API_URL}/analytics/user-stats${forceRefresh ? '?refresh=true' : ''}`;
            const res = await axios.get(url, { withCredentials: true });
            if (res.data.success) {
                setData(res.data.analytics);
            }
        } catch (err) {
            console.error("Failed to fetch analytics", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center h-screen bg-transparent">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
    );

    if (!data || Object.keys(data.skill_graph || {}).length === 0) return (
        <div className="p-10 text-center text-gray-500">
            <LayoutDashboard className="mx-auto h-12 w-12 mb-4 opacity-20" />
            <h2 className="text-xl font-semibold">No Analytics Data Yet</h2>
            <p className="mt-2 text-sm">Create posts with descriptive captions to run the ML pipeline!</p>
        </div>
    );

    const skillData = Object.entries(data.skill_graph || {}).map(([name, value]) => ({ name, value }));
    const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE'];

    const handleExportData = () => {
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: "application/json" });
        const href = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = href;
        link.download = `zocial_intelligence_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExportLedger = async () => {
        try {
            const url = `${import.meta.env.VITE_API_URL}/analytics/export-ledger`;
            const response = await axios.get(url, { 
                withCredentials: true,
                responseType: 'blob' // Important for file downloads
            });
            
            const href = URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = href;
            link.download = `zocial_ledger_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error("Failed to export ledger", err);
            let errorMessage = "Failed to export ledger. Please try again later.";

            // If responseType is 'blob', the error data is also a Blob
            if (err.response?.data instanceof Blob) {
                try {
                    const text = await err.response.data.text();
                    const errorJson = JSON.parse(text);
                    errorMessage = errorJson.message || errorMessage;
                } catch (parseError) {
                    console.error("Error parsing blob error response", parseError);
                }
            } else if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            }

            toast.error(errorMessage);
        }
    };

    return (
        <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
                        <Zap className="text-purple-600 h-8 w-8" />
                        Network Intelligence
                    </h1>
                    <p className="text-gray-500 mt-1 font-medium">Data-driven career influence & engagement analytics powered by ML</p>
                </div>
                <div className="flex flex-wrap gap-3 items-center">
                    <Button 
                        onClick={() => fetchAnalytics(true)} 
                        disabled={loading}
                        variant="secondary" 
                        className="gap-2 text-xs font-bold rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border-none px-4"
                    >
                        <Zap className={`h-3 w-3 ${loading ? 'animate-pulse' : ''}`} /> 
                        {loading ? 'Analyzing...' : 'Refresh Intelligence'}
                    </Button>
                    <Button onClick={handleExportLedger} variant="outline" className="gap-2 text-xs font-bold rounded-xl border-slate-200 bg-slate-50 text-slate-700">
                        <Briefcase className="h-3 w-3" /> Export BI Ledger (.csv)
                    </Button>
                    <Button onClick={handleExportData} variant="outline" className="gap-2 text-xs font-bold rounded-xl border-slate-200">
                        <Download className="h-3 w-3" /> Export JSON
                    </Button>
                    <Badge className="bg-indigo-100 text-indigo-700 border-none px-3 py-1.5 font-bold tracking-tight">
                        AI Status: Certified
                    </Badge>
                </div>
            </div>

            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { title: "Influence Score", value: `${data.influence_score}/100`, icon: Award, color: "text-purple-600", bg: "bg-purple-50" },
                    { title: "Engagement EMA", value: data.engagement_density.toFixed(1), icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
                    { title: "Momentum", value: `${data.velocity_momentum > 0 ? '+' : ''}${data.velocity_momentum}%`, icon: Activity, color: "text-blue-600", bg: "bg-blue-50" },
                    { title: "Discovered Topics", value: skillData.length, icon: Briefcase, color: "text-orange-600", bg: "bg-orange-50" }
                ].map((stat, i) => (
                    <Card key={i} className="border-none shadow-lg bg-white/50 backdrop-blur-md overflow-hidden transition-transform hover:scale-[1.02]">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{stat.title}</p>
                                    <h3 className="text-3xl font-black text-gray-900 mt-1">{stat.value}</h3>
                                </div>
                                <div className={`p-3 rounded-2xl ${stat.bg}`}>
                                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Sentiment Trend */}
                <Card className="border-none shadow-xl bg-white/80 backdrop-blur-xl">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold">Content Sentiment Analysis</CardTitle>
                        <CardDescription>Historical NLP trend of post positivity</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        {data.sentiment_trend.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data.sentiment_trend}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                    />
                                    <Line type="monotone" name="Sentiment Core" dataKey="sentiment" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, fill: '#8b5cf6' }} activeDot={{ r: 8 }} />
                                    <Line type="monotone" name="Engagements" dataKey="engagement" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-slate-400 font-medium">Not enough data points.</div>
                        )}
                    </CardContent>
                </Card>

                {/* Skill Graph */}
                <Card className="border-none shadow-xl bg-white/80 backdrop-blur-xl">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold">Career Focus NLP Mapping</CardTitle>
                        <CardDescription>Top topics extracted driving your network growth</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        {skillData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={skillData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                    <XAxis dataKey="name" />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{ borderRadius: '12px', border: 'none' }} />
                                    <Bar dataKey="value" name="Mentions" radius={[8, 8, 0, 0]}>
                                        {skillData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-slate-400 font-medium">Add descriptive captions to map NLP topics.</div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
