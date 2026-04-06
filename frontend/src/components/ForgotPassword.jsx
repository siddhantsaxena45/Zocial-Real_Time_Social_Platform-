import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { Link } from 'react-router-dom'
import { Loader2, Zap, Mail, ArrowLeft } from 'lucide-react'

const ForgotPassword = () => {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/user/forgot-password`, { email }, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            });
            if (res.data.success) {
                setSent(true)
                toast.success(res.data.message)
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Recovery request failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-6 bg-mesh relative overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-indigo-600 shadow-xl shadow-indigo-200 mb-6 group transition-transform hover:scale-110">
                        <Zap className="h-8 w-8 text-white fill-white" />
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter text-slate-900 mb-2">
                        RECOVER<span className="text-indigo-600">.</span>
                    </h1>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">Access Key Recovery</p>
                </div>

                <div className="glass-card p-10 shadow-2xl border-white/40">
                    {!sent ? (
                        <>
                            <div className="mb-8">
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Lost Your Key?</h2>
                                <p className="text-slate-500 text-sm font-medium mt-1">Enter your credential email to initiate recovery.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="group">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 px-1 group-focus-within:text-indigo-600 transition-colors">Credential Email</label>
                                    <div className="relative">
                                        <input
                                            onChange={(e) => setEmail(e.target.value)}
                                            name="email"
                                            type="email"
                                            value={email}
                                            required
                                            placeholder="name@company.com"
                                            className="w-full bg-slate-50/50 border-2 border-slate-100/50 rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-500/5"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-4 text-xs font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-indigo-200 transition-all hover:bg-indigo-700 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
                                >
                                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                                    Send Recovery Intel
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-4">
                            <div className="h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <ShieldCheck className="h-8 w-8 text-emerald-600" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Intel Sent!</h2>
                            <p className="text-slate-500 text-sm font-medium mb-8">
                                Check your terminal console (in dev) or email for the recovery token.
                            </p>
                            <Link 
                                to="/reset-password" 
                                className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
                            >
                                Enter Reset Token
                            </Link>
                        </div>
                    )}

                    <div className="mt-8 pt-8 border-t border-slate-100 text-center">
                        <Link to="/login" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors">
                            <ArrowLeft className="h-3 w-3" /> Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Inline helper because I missed importing it
const ShieldCheck = ({className}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>

export default ForgotPassword
