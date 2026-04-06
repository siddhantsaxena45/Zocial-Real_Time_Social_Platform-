import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { getTopLikedPostsLastHour, getEngagementBreakdown, getEngagementHistory } from "../utils/sql_ledger.js";

// Enterprise Microservice Target (Fallback to localhost on port 5000 for development)
const PYTHON_MICROSERVICE_URL = process.env.PYTHON_MICROSERVICE_URL || 'http://127.0.0.1:5000/api/v1/analyze';

export const getUserAnalytics = async (req, res) => {
    try {
        const userId = req.id; // From isAuthenticated middleware
        const user = await User.findById(userId).select("-password");
        const posts = await Post.find({ author: userId });

        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        const { refresh } = req.query;
        
        // 🚀 SMART CACHE: Skip analysis only if post AND interaction counts match
        const currentInteractionCount = posts.reduce((acc, post) => acc + post.likes.length + post.comments.length, 0);

        if (!refresh && user.analytics_cache && 
            user.posts.length === user.lastAnalyzedPostCount &&
            currentInteractionCount === user.lastAnalyzedInteractionCount) {
            console.log(`[Analytics] Serving cached results for ${user.username} (0ms latency)`);
            return res.status(200).json({ analytics: user.analytics_cache, success: true, cached: true });
        }

        const dataToAnalyze = {
            user,
            posts
        };

        try {
            // Native HTTP fetch to the isolated Python FastAPI microservice
            const response = await fetch(PYTHON_MICROSERVICE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToAnalyze)
            });

            if (!response.ok) {
                console.error(`[Microservice Error] Status: ${response.status}`);
                return res.status(500).json({ message: "Analytics engine failed", success: false });
            }

            const data = await response.json();
            if (data.success) {
                // Permanently cache ML-extracted insights into the user's DB profile
                const extractedSkills = data.analytics.skill_graph ? Object.keys(data.analytics.skill_graph) : [];
                const aiSummary = data.analytics.ai_summary || "";
                
                await User.findByIdAndUpdate(userId, { 
                    skills: extractedSkills,
                    ai_summary: aiSummary,
                    analytics_cache: data.analytics,
                    lastAnalyzedPostCount: user.posts.length,
                    lastAnalyzedInteractionCount: currentInteractionCount
                });
                
                return res.status(200).json({ analytics: data.analytics, success: true });
            } else {
                console.error(`[Microservice Syntax Error] ${data.error}`);
                return res.status(500).json({ message: "Analytics algorithm error", success: false });
            }
            
        } catch (fetchError) {
            console.error("Connection to Python Microservice refused. Is the FastAPI server running?", fetchError.message);
            return res.status(503).json({ 
                message: "Analytics Engine is offline. Please boot the Python microservice.", 
                success: false 
            });
        }

    } catch (error) {
        res.status(500).json({ message: "Internal server error", success: false });
    }
};

export const getGlobalEngagementStats = async (req, res) => {
    try {
        const topPosts = await getTopLikedPostsLastHour(5);
        const breakdown = await getEngagementBreakdown();
        
        return res.status(200).json({ 
            success: true, 
            topPosts, 
            breakdown 
        });
    } catch (error) {
        console.error("SQL Aggregation Error:", error);
        res.status(500).json({ message: "Failed to fetch SQL engagement stats", success: false });
    }
};

export const exportUserLedger = async (req, res) => {
    try {
        const userId = req.id;
        const history = await getEngagementHistory(userId);
        
        if (!history || history.length === 0) {
            return res.status(404).json({ message: "No ledger entries found for your account.", success: false });
        }

        // Convert JSON to CSV manually for minimum overhead
        const headers = "id,userId,postId,type,timestamp\n";
        const rows = history.map(row => `${row.id},${row.userId},${row.postId},${row.type},${row.timestamp}`).join("\n");
        const csvContent = headers + rows;

        // Set Headers for File Download
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", `attachment; filename=zocial_ledger_${userId}.csv`);
        
        return res.status(200).send(csvContent);
    } catch (error) {
        console.error("Ledger Export Error:", error);
        res.status(500).json({ message: "Internal server error during ledger export", success: false });
    }
};
