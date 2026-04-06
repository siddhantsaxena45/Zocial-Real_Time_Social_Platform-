import { useEffect } from "react";
import { useDispatch } from "react-redux";

import axios from "axios";
import { setUserProfile } from "@/redux/authSlice";
import { toast } from "sonner";

const useGetUserProfile = (userId) => {
  
    const dispatch = useDispatch();
    const fetchUserProfile = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/${userId}/profile`, { withCredentials: true });

            if (response.data.success) {

                dispatch(setUserProfile(response.data.user))
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Profile fetch failed");
        }
    }

    useEffect(() => {
        fetchUserProfile();
    }, [userId])

    return { fetchUserProfile };


}

export default useGetUserProfile