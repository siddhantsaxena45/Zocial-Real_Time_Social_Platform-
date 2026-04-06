import os
import sys
import json
import math
import re
from collections import defaultdict, Counter
from typing import List, Optional, Any
from pydantic import BaseModel, Field
from dotenv import load_dotenv

# Load Environment Variables for Gemini API Key
# 🛡️ ROBUSTNESS: Explicitly find the .env file even if script is run from project root
script_path = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(script_path, ".env"))


# ==========================================
# 1. Pydantic DTOs (Data Transfer Objects)
# ==========================================
# These classes mathematically secure the data structure coming from the Node/React frontend.
# Instead of guessing dictionary keys ('data.get("user")'), we force strict structural typing!

class UserData(BaseModel):
    id: str = Field(alias='_id', default='')
    username: str = ''
    followers: List[Any] = []
    following: List[Any] = []
    
class PostData(BaseModel):
    id: str = Field(alias='_id', default='')
    caption: str = ''
    likes: List[Any] = []
    comments: List[Any] = []
    createdAt: str

class AnalyticsPayload(BaseModel):
    user: UserData
    posts: List[PostData]


# ==========================================
# 2. NLP and AI Core Modules
# ==========================================

class TextProcessor:
    """Advanced Text Processing Pipeline for Keyword Extraction"""
    
    STOP_WORDS = set([
        "the", "is", "in", "at", "of", "on", "and", "a", "to", "it", "for", "with", 
        "as", "by", "this", "that", "i", "my", "you", "we", "are", "be", "have", "has",
        "was", "were", "but", "or", "an", "not", "so", "if", "they", "them", "their",
        "very", "really", "just", "too", "much", "many", "some", "any", "all", "what",
        "who", "when", "where", "why", "how", "from", "about", "into", "over", "after",
        "then", "than", "will", "can", "could", "would", "should", "here", "there",
        "out", "now", "did", "does", "been", "had", "got", "get", "make", "made",
        "like", "our", "your", "am", "do", "dont", "cant", "didnt", "which", "its",
        # 🛡️ Quality Control Blacklist (Sentiment/Generic Corporate Noise)
        "proud", "success", "successfully", "happy", "announce", "announcement", "pleased",
        "thrilled", "congratulations", "excellent", "awesome", "amazing", "great", "work",
        "job", "today", "yesterday", "tomorrow", "week", "month", "year", "sharing",
        "excited", "learning", "journey", "experience", "building", "completed", "achieved",
        "finished", "architecting", "architecture", "built", "using", "uses", "used",
        "started", "starting", "new", "pairing", "paired", "integrating", "integration",
        "choice", "choosing", "chose", "awesome", "awesome", "cool", "fun", "love", "like"
    ])

    # 💎 The Golden Lexicon: Prioritize these industry-standard keywords
    TECHNICAL_SKILLS = set([
        "python", "javascript", "react", "node", "nodejs", "express", "expressjs",
        "mongodb", "sql", "machine learning", "data science", "java", "cpp", "c++", 
        "c#", "docker", "kubernetes", "aws", "azure", "tableau", "power bi", "analytics", 
        "nlp", "ai", "fastapi", "express", "tailwind", "github", "git", "devops", 
        "frontend", "backend", "fullstack", "pandas", "numpy", "pytorch", "tensorflow", 
        "scikit-learn", "flask", "django", "typescript", "html", "css", "nextjs",
        "vue", "angular", "redux", "graphql", "rest", "api", "machine learning",
        "data science", "tailwind css", "next js", "react native", "cloud computing",
        "artificial intelligence", "deep learning", "software engineering"
    ])

    @staticmethod
    def clean_text(text):
        text = str(text).lower()
        text = re.sub(r'[^a-z0-9\s-]', '', text)
        return text

    @classmethod
    def extract_keywords(cls, text, top_n=3):
        words = cls.clean_text(text).split()
        filtered = [w for w in words if w not in cls.STOP_WORDS and len(w) > 2]
        
        # Simple bigram detection
        bigrams = [" ".join(filtered[i:i+2]) for i in range(len(filtered)-1)]
        
        candidates = filtered + bigrams
        
        # 🧠 Weighted Scoring System
        scores = defaultdict(float)
        for term in candidates:
            # Baseline frequency
            scores[term] += 1.0
            
            # Whitelist Boosting (5x weight)
            if term in cls.TECHNICAL_SKILLS:
                scores[term] += 5.0
                
        # Sorted by weighted score
        sorted_skills = sorted(scores.items(), key=lambda x: x[1], reverse=True)
        return [word for word, score in sorted_skills[:top_n]]


class SentimentAnalyzer:
    """Valence-Aware Dictionary Sentiment Reasoner (VADER-lite)"""
    
    LEXICON = {
        'excellent': 3.0, 'outstanding': 3.0, 'awesome': 2.5, 'great': 2.0, 'good': 1.5,
        'happy': 2.0, 'love': 2.5, 'success': 2.5, 'proud': 2.5, 'achieved': 2.0,
        'growth': 1.5, 'innovative': 2.0, 'breakthrough': 2.5, 'collaboration': 1.5,
        'bad': -1.5, 'poor': -2.0, 'terrible': -3.0, 'failed': -2.5, 'worst': -3.0,
        'issue': -1.0, 'problem': -1.5, 'bug': -1.0, 'stagnant': -1.5, 'frustrating': -2.0
    }
    
    NEGATORS = set(['not', "isn't", "aren't", "wasn't", 'never', 'hardly', 'lack'])
    AMPLIFIERS = set(['very', 'extremely', 'absolutely', 'highly', 'incredibly'])

    @classmethod
    def analyze(cls, text):
        words = TextProcessor.clean_text(text).split()
        score = 0.0
        
        for i, word in enumerate(words):
            if word in cls.LEXICON:
                val = cls.LEXICON[word]
                
                # Lookback for modifiers
                if i > 0 and words[i-1] in cls.NEGATORS:
                    val = val * -0.5  # Reverse and dampen
                elif i > 0 and words[i-1] in cls.AMPLIFIERS:
                    val = val * 1.5   # Amplify
                    
                score += val
                
        # Sigmoid normalization to return a score between -1 and 1
        normalized = score / math.sqrt(score**2 + 15)
        return normalized


class GeminiAnalyzer:
    """Enterprise-grade Semantic Reasoner using Google Gemini AI"""
    
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        self.enabled = False
        
        # 🔍 DIAGNOSTIC LOGS
        print(f"--- [Gemini Initialization] ---")
        if self.api_key:
            print(f"✅ GEMINI_API_KEY found: {self.api_key[:10]}...")
            try:
                from google import genai
                self.client = genai.Client(api_key=self.api_key)
                # 🚀 Use the latest high-speed Gemini Flash model
                self.model_name = 'gemini-2.5-flash' 
                self.enabled = True
                print(f"✅ Gemini SDK (google-genai) imported successfully.")
                print(f"✅ AI Engine status: ENABLED")
            except ImportError:
                print("❌ ERROR: Gemini SDK (google-genai) NOT INSTALLED.")
                print("   Run: pip install google-genai")
                print("   AI Engine status: DISABLED (Falling back to rule-based logic)")
        else:
            print("❌ ERROR: GEMINI_API_KEY NOT FOUND in environment.")
            print("   Ensure .env file exists and GEMINI_API_KEY is defined.")
            print("   AI Engine status: DISABLED (Falling back to rule-based logic)")
        print(f"-------------------------------")

    def extract_semantic_skills(self, posts_text: str) -> List[str]:
        if not self.enabled: return []
        
        prompt = f"""
        Analyze the following social media posts from a professional user.
        Identify the top 5 technical skills or professional competencies mentioned.
        Ignore narrative filler, generic verbs (like 'finished', 'architected'), and sentiment.
        Return ONLY a comma-separated list of technical terms.
        
        Posts content:
        {posts_text[:2000]}
        """
        try:
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt
            )
            if not response or not response.text:
                return []
            skills = [s.strip() for s in response.text.split(',')]
            return skills[:5]
        except Exception as e:
            print(f"Gemini API Error: {str(e)}")
            return []

    def generate_career_summary(self, posts_text: str, username: str) -> str:
        if not self.enabled: return ""
        
        prompt = f"""
        Based on these professional posts, write a concise, powerful 1-paragraph career summary for {username}.
        Focus on their technical stack, their achievements, and their professional intent.
        Make it sound like a high-end recruiter wrote it.
        Keep it under 60 words.
        
        Posts content:
        {posts_text[:3000]}
        """
        try:
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt
            )
            if not response or not response.text:
                return ""
            return response.text.strip()
        except Exception as e:
            print(f"Gemini Summary Error: {str(e)}")
            return ""



class EngagementPredictor:
    """Calculates engagement velocity and momentum using Exponential Moving Averages (EMA)"""
    
    @staticmethod
    def calculate_ema(data_points, alpha=0.3):
        if not data_points: return 0.0
        ema = data_points[0]
        for point in data_points[1:]:
            ema = (alpha * point) + ((1 - alpha) * ema)
        return ema


# ==========================================
# 3. Main Algorithm Execution Engine
# ==========================================

class ZocialIntelligenceEngine:
    """Core Algorithm Engine driving the Zocial Platform"""
    
    def __init__(self, data: AnalyticsPayload):
        # We can now confidently use dot notation because Pydantic guarantees the structure!
        self.posts = sorted(data.posts, key=lambda x: x.createdAt)
        self.user = data.user
        self.results = {
            "sentiment_trend": [],
            "engagement_density": 0,
            "influence_score": 0,
            "skill_graph": {},
            "velocity_momentum": 0,
            "profile_health_index": 0,
            "ai_summary": ""
        }
        self.gemini = GeminiAnalyzer()

    def run_pipeline(self):
        if not self.posts:
            return self.results
            
        engagements = []
        global_topics = Counter()
        all_text = ""
        
        for post in self.posts:
            caption = post.caption
            all_text += caption + " \n"
            likes = len(post.likes)
            comments = len(post.comments)
            total_eng = likes + (comments * 2) 

            
            engagements.append(total_eng)
            
            # 1. Advanced Sentiment Analysis
            raw_sentiment = SentimentAnalyzer.analyze(caption)
            
            # Map from [-1, 1] to [0, 100] for UI
            ui_sentiment = round((raw_sentiment + 1) * 50, 1)
            
            self.results["sentiment_trend"].append({
                "date": post.createdAt.split('T')[0],
                "sentiment": ui_sentiment,
                "engagement": total_eng
            })
            
            # 2. Topic/Skill Extraction Mapping
            topics = TextProcessor.extract_keywords(caption)
            global_topics.update(topics)

        # 3. Topic Graph Processing 
        # HYBRID LOGIC: Use Gemini if enabled, otherwise our rule-based lexicon
        if self.gemini.enabled:
            semantic_skills = self.gemini.extract_semantic_skills(all_text)
            if semantic_skills:
                # We overwrite the graph with semantic intelligence
                self.results["skill_graph"] = {skill: 100 for skill in semantic_skills}
                self.results["ai_summary"] = self.gemini.generate_career_summary(all_text, self.user.username)
                
                # FALLBACK check if summarizer failed
                if not self.results["ai_summary"]:
                     self.results["ai_summary"] = "AI Career Summary processed (Rule-based). Connect GEMINI_API_KEY for deeper semantic analysis."
            else:
                self.results["skill_graph"] = dict(global_topics.most_common(6))
                self.results["ai_summary"] = "Generating rules-based summary... (Gemini API 404 Fallback)"
        else:
            self.results["skill_graph"] = dict(global_topics.most_common(6))
            self.results["ai_summary"] = "Real-AI summary unavailable. Please add GEMINI_API_KEY to .env for semantic insights."

        
        # 4. Engagement Momentum using EMA
        ema = EngagementPredictor.calculate_ema(engagements)
        self.results["engagement_density"] = round(ema, 2)
        
        # Calculate velocity trend (momentum)
        if len(engagements) > 1:
            recent_avg = sum(engagements[-3:]) / min(3, len(engagements))
            self.results["velocity_momentum"] = round(((recent_avg - ema) / (ema + 1)) * 100, 1)

        # 5. Algorithmic Influence Ranking
        followers = len(self.user.followers)
        following = len(self.user.following)
        
        # Hub/Authority Ratio 
        network_ratio = followers / max(following, 1)
        consistency_multiplier = math.log10(len(self.posts) + 1)
        
        # Complex TrustRank-inspired Scoring
        raw_influence = (ema * 0.4) + (followers * 0.4 * network_ratio) + (consistency_multiplier * 0.2)
        
        # Sigmoid curve clamping to a 0-100 max logarithmic scale
        clamped_score = 100 * (1 - math.exp(-0.05 * raw_influence))
        self.results["influence_score"] = round(clamped_score, 1)
        
        # Profile Health Index Outlier Status
        self.results["profile_health_index"] = "Exceptional" if clamped_score > 80 else "Growth Phase"
        
        return self.results


# ==========================================
# 4. Enterprise Microservice Controller
# ==========================================

def run_fastapi_microservice(port=5000):
    try:
        from fastapi import FastAPI
        import uvicorn

        app = FastAPI(title="Zocial Intelligence Engine API")

        # FastAPI completely auto-parses the payload into the Pydantic AnalyticsPayload class!
        @app.post("/api/v1/analyze")
        async def analyze_data(payload: AnalyticsPayload):
            try:
                engine = ZocialIntelligenceEngine(payload)
                results = engine.run_pipeline()
                return {"success": True, "analytics": results}
            except Exception as e:
                return {"success": False, "error": str(e)}

        print(f"🚀 Zocial Machine Learning FastAPI Microservice running independently on port {port}...")
        uvicorn.run(app, host="0.0.0.0", port=port)

    except ImportError:
        print("ERROR: FastAPI or Uvicorn is not installed.")
        print("To deploy the FastAPI microservice, please run: pip install fastapi uvicorn pydantic")
        sys.exit(1)


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == '--serve':
        port = int(sys.argv[2]) if len(sys.argv) > 2 else 5000
        run_fastapi_microservice(port)
    elif len(sys.argv) > 1:
        try:
            input_data = json.loads(sys.argv[1])
            # Parse dict into Pydantic Class explicitly for backwards-compatibility
            payload = AnalyticsPayload(**input_data)
            engine = ZocialIntelligenceEngine(payload)
            pipeline_results = engine.run_pipeline()
            print(json.dumps(pipeline_results))
        except Exception as e:
            print(json.dumps({"error": str(e)}))
    else:
        print(json.dumps({"error": "No data stream provided to Zocial Engine"}))
