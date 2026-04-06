import unittest
from unittest.mock import MagicMock, patch
import json
import math
import sys
import os

# Add the backend directory to sys.path to import analytics_engine
sys.path.append(os.path.dirname(os.path.abspath(__file__)) + "/..")

from analytics_engine import EngagementPredictor, ZocialIntelligenceEngine, AnalyticsPayload, UserData, PostData

class TestAnalyticsEngine(unittest.TestCase):

    def test_ema_calculation(self):
        """Test Exponential Moving Average (EMA) mathematical correctness"""
        data = [10, 20, 30]
        alpha = 0.3
        
        # Manual Calculation:
        # ema0 = 10
        # ema1 = 0.3 * 20 + 0.7 * 10 = 6 + 7 = 13
        # ema2 = 0.3 * 30 + 0.7 * 13 = 9 + 9.1 = 18.1
        
        calculated_ema = EngagementPredictor.calculate_ema(data, alpha)
        self.assertAlmostEqual(calculated_ema, 18.1, places=1)

    def test_ema_empty(self):
        self.assertEqual(EngagementPredictor.calculate_ema([]), 0.0)

    def test_influence_score_clamping(self):
        """Test that influence score is clamped between 0 and 100 using sigmoid formula"""
        # Create a mock payload
        user = UserData(_id="user1", username="testuser", followers=[1]*1000, following=[1]*10)
        posts = [PostData(_id="p1", caption="test", likes=[1]*100, comments=[], createdAt="2024-01-01T00:00:00Z")]
        payload = AnalyticsPayload(user=user, posts=posts)
        
        engine = ZocialIntelligenceEngine(payload)
        results = engine.run_pipeline()
        
        self.assertGreaterEqual(results["influence_score"], 0)
        self.assertLessEqual(results["influence_score"], 100)
        
    def test_sentiment_mapping(self):
        """Test that sentiment is correctly mapped from [-1, 1] to [0, 100]"""
        user = UserData(_id="user1", username="testuser", followers=[], following=[])
        # "Excellent" has score 3.0 in SentimentAnalyzer.LEXICON
        # raw_sentiment = 3.0 / sqrt(3.0^2 + 15) = 3 / sqrt(24) ≈ 0.612
        # ui_sentiment = (0.612 + 1) * 50 ≈ 80.6
        
        posts = [PostData(_id="p1", caption="excellent", likes=[], comments=[], createdAt="2024-01-01T00:00:00Z")]
        payload = AnalyticsPayload(user=user, posts=posts)
        
        engine = ZocialIntelligenceEngine(payload)
        results = engine.run_pipeline()
        
        self.assertGreater(results["sentiment_trend"][0]["sentiment"], 50)

if __name__ == '__main__':
    unittest.main()
