import { useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setAuthUser } from '../redux/authSlice';
import { setPosts, setSelectedPost } from '../redux/postSlice';
import { clearNotifications } from '../redux/rtnSlice';
import { clearMessages } from '../redux/messageNotificationSlice';
import { toast } from 'sonner';

const useAxiosInterceptor = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response && error.response.status === 401) {
                    // Prevent redirect loop if already on login page
                    if (window.location.pathname === "/login") {
                        return Promise.reject(error);
                    }

                    const message = error.response.data.message || "Session expired. Please log in again.";
                    
                    // Clear all session-related Redux state
                    dispatch(setAuthUser(null));
                    dispatch(setPosts([]));
                    dispatch(setSelectedPost(null));
                    dispatch(clearNotifications());
                    dispatch(clearMessages());

                    // Notify the user
                    toast.error(message);

                    // Redirect to login using SPA navigation
                    navigate("/login");
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, [dispatch, navigate]);
};

export default useAxiosInterceptor;
