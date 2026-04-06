import { createSlice } from "@reduxjs/toolkit";

const callSlice = createSlice({
    name: "call",
    initialState: {
        incomingCall: false,
        callerInfo: null, // { from, offer, userDetails }
        activeCall: false,
        isMuted: false,
        isCameraOff: false,
    },
    reducers: {
        setIncomingCall: (state, action) => {
            state.incomingCall = action.payload.incoming;
            state.callerInfo = action.payload.info;
        },
        setActiveCall: (state, action) => {
            state.activeCall = action.payload;
            if (!action.payload) {
                state.incomingCall = false;
                state.callerInfo = null;
            }
        },
        toggleMute: (state) => {
            state.isMuted = !state.isMuted;
        },
        toggleCamera: (state) => {
            state.isCameraOff = !state.isCameraOff;
        },
        resetCall: (state) => {
            state.incomingCall = false;
            state.callerInfo = null;
            state.activeCall = false;
            state.isMuted = false;
            state.isCameraOff = false;
        }
    }
});

export const { setIncomingCall, setActiveCall, toggleMute, toggleCamera, resetCall } = callSlice.actions;
export default callSlice.reducer;
