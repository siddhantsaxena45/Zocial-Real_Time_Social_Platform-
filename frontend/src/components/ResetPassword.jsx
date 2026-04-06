import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { useNavigate, Link } from 'react-router-dom'
import { Loader2, Zap, Key, ArrowLeft, ShieldAlert } from 'lucide-react'

const ResetPassword = () => {
    const [input, setInput] = useState({
        token: "",
        newPassword: "",
    })
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleChange = (e) => {
        setInput({
            ...input,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/user/reset-password`, input, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message)
                navigate("/login")
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Reset failed")
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
                        RECODE<span className="text-indigo-600">.</span>
                    </h1>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">Access Key Override</p>
                </div>

                <div className="glass-card p-10 shadow-2xl border-white/40">
                    <div className="mb-8">
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Set New Access Key</h2>
                        <p className="text-slate-500 text-sm font-medium mt-1">Provide your recovery token and new secure key.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="group">
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 px-1 group-focus-within:text-indigo-600 transition-colors">Recovery Token</label>
                                <input
                                    onChange={handleChange}
                                    name="token"
                                    type="text"
                                    value={input.token}
                                    required
                                    placeholder="40-character hex string"
                                    className="w-full bg-slate-50/50 border-2 border-slate-100/50 rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-500/5"
                                />
                            </div>

                            <div className="group">
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 px-1 group-focus-within:text-indigo-600 transition-colors">New Access Key</label>
                                <input
                                    onChange={handleChange}
                                    name="newPassword"
                                    type="password"
                                    value={input.newPassword}
                                    required
                                    placeholder="••••••••"
                                    className="w-full bg-slate-50/50 border-2 border-slate-100/50 rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-500/5"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-4 text-xs font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-slate-200 transition-all hover:bg-black hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Key className="h-4 w-4" />}
                            Override Access Key
                        </button>
                    </form>

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

export default ResetPassword
