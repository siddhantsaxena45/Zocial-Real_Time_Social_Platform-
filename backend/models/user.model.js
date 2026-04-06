import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilepicture: {
        type: String,
        default: "",
    },
    bio: {
        type: String,
        default: "",
    },
    skills: [{
        type: String,
    }],
    ai_summary: {
        type: String,
        default: "",
    },
    lastAnalyzedPostCount: {
        type: Number,
        default: 0,
    },
    lastAnalyzedInteractionCount: {
        type: Number,
        default: 0,
    },
    analytics_cache: {
        type: Object,
        default: null
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
    }],
    bookmarks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
    }],
    resetPasswordToken: String,
    resetPasswordExpires: Date,

}, { timestamps: true });

export const User = mongoose.model("User", userSchema);