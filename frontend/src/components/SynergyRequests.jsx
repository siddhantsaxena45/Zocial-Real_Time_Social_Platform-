import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { UserCheck, UserX, Loader2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { markSynergyNotificationsSeen } from '@/redux/rtnSlice';

const SynergyRequests = ({ open, setOpen }) => {
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();

    const fetchRequests = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/user/synergy/pending`, { withCredentials: true });
            if (res.data.success) {
                setRequests(res.data.requests);
            }
        } catch (error) {
            console.error("Error fetching synergy requests:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (open) {
            fetchRequests();
        }
    }, [open]);

    const handleAction = async (requestId, action) => {
        try {
            const endpoint = action === 'accept' ? 'accept' : 'reject';
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/user/synergy/${endpoint}/${requestId}`, {}, { withCredentials: true });
             if (res.data.success) {
                toast.success(res.data.message);
                dispatch(markSynergyNotificationsSeen());
                setRequests(requests.filter(req => req._id !== requestId));
            }
        } catch (error) {
            toast.error("Action failed");
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-indigo-50/30">
                    <h2 className="text-sm font-black uppercase tracking-[0.2em] text-indigo-600">Synergy Requests</h2>
                    <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold text-xl">×</button>
                </div>

                <div className="max-h-[400px] overflow-y-auto p-4 space-y-4">
                    {isLoading ? (
                        <div className="flex justify-center py-10">
                            <Loader2 className="h-6 w-6 text-indigo-600 animate-spin" />
                        </div>
                    ) : requests.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">No pending synergy requests</p>
                        </div>
                    ) : (
                        requests.map((request) => (
                            <div key={request._id} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 group transition-all hover:bg-white hover:shadow-md">
                                <Avatar className="h-12 w-12 rounded-xl shadow-sm border border-white">
                                    <AvatarImage src={request.sender?.profilepicture} />
                                    <AvatarFallback>{request.sender?.username?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-xs font-black text-slate-900 truncate">{request.sender?.username}</h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight truncate">{request.sender?.bio || "Future Collaborator"}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => handleAction(request._id, 'accept')}
                                        className="p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                                    >
                                        <UserCheck className="h-4 w-4" />
                                    </button>
                                    <button 
                                        onClick={() => handleAction(request._id, 'reject')}
                                        className="p-2 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-100 transition-colors"
                                    >
                                        <UserX className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                
                <div className="p-4 bg-slate-50/50 border-t border-slate-100">
                    <Button 
                        onClick={() => setOpen(false)}
                        className="w-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 font-black uppercase tracking-widest text-[10px] py-6 rounded-2xl"
                    >
                        Minimize Hub
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SynergyRequests;
