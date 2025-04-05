from flask import Flask, request, jsonify
import numpy as np
import json
import re
from collections import Counter

app = Flask(__name__)

# Simulated NLP model for driver reviews
class SimpleNLPModel:
    def __init__(self):
        # Positive sentiment words
        self.positive_words = [
            "excellent", "amazing", "outstanding", "brilliant", "exceptional",
            "great", "good", "awesome", "fantastic", "wonderful", "professional",
            "helpful", "friendly", "polite", "courteous", "reliable", "punctual",
            "timely", "safe", "clean", "comfortable", "responsive", "attentive",
            "skilled", "expert", "knowledgeable", "experienced", "efficient"
        ]
        
        # Negative sentiment words
        self.negative_words = [
            "poor", "bad", "terrible", "awful", "horrible", "disappointing",
            "rude", "unprofessional", "unreliable", "late", "dirty", "unsafe",
            "uncomfortable", "slow", "unresponsive", "careless", "inexperienced",
            "inefficient", "dangerous", "aggressive", "unprepared", "confused",
            "distracted", "impatient", "unpunctual", "messy"
        ]
        
        # Driver skill/aspect related words
        self.skill_words = {
            "driving_skill": ["drive", "driving", "skill", "control", "maneuver", "handling", "navigate"],
            "communication": ["communicate", "communication", "response", "responsive", "talk", "explain", "update"],
            "punctuality": ["punctual", "time", "early", "late", "delay", "wait", "schedule", "arrival"],
            "professionalism": ["professional", "manner", "conduct", "behavior", "attitude", "respectful", "courteous"],
            "vehicle_condition": ["car", "vehicle", "clean", "maintained", "condition", "interior", "exterior"]
        }
        
        # Load driver info
        self.driver_info = {
            1: {"name": "James Wilson", "experience": 5},
            2: {"name": "Sarah Chen", "experience": 8},
            3: {"name": "Michael Rodriguez", "experience": 3}
        }
        
    def analyze_text(self, text, driver_id):
        text = text.lower()
        
        # Get driver info
        driver = self.driver_info.get(driver_id, {"name": "Unknown Driver", "experience": 0})
        
        # Calculate sentiment
        positive_count = sum(1 for word in self.positive_words if re.search(r'\\b' + word + r'\\b', text))
        negative_count = sum(1 for word in self.negative_words if re.search(r'\\b' + word + r'\\b', text))
        
        sentiment_score = (positive_count - negative_count) / max(1, (positive_count + negative_count)) * 5
        sentiment_score = min(5, max(1, sentiment_score + 3))  # Normalize to 1-5 scale with baseline of 3
        
        # Analyze skills
        skill_scores = {}
        for skill, keywords in self.skill_words.items():
            matches = sum(1 for word in keywords if re.search(r'\\b' + word + r'\\b', text))
            score = min(5, matches + 3)  # Base score of 3 plus matches, max of 5
            skill_scores[skill] = score
        
        # Generate meaningful insights
        insights = []
        
        # Experience-based insights
        if driver["experience"] > 5:
            insights.append(f"{driver['name']}'s {driver['experience']} years of experience clearly shows in their driving skills.")
        
        # Sentiment-based insights
        if sentiment_score > 4:
            insights.append("Passengers consistently rate this driver very highly.")
        elif sentiment_score < 2:
            insights.append("There may be some areas where this driver could improve.")
        
        # Skill-based insights
        top_skill = max(skill_scores.items(), key=lambda x: x[1], default=("none", 0))
        if top_skill[1] > 3:
            skill_name = top_skill[0].replace("_", " ").title()
            insights.append(f"{skill_name} is this driver's strongest attribute based on passenger reviews.")
        
        # Generate personalized recommendations
        lowest_skill = min(skill_scores.items(), key=lambda x: x[1], default=("none", 5))
        recommendations = []
        if lowest_skill[1] < 4:
            skill_name = lowest_skill[0].replace("_", " ").title()
            recommendations.append(f"Consider focusing on improving {skill_name} for better passenger satisfaction.")
        
        # If the driver is highly rated, still provide some meaningful recommendation
        if sentiment_score > 4 and not recommendations:
            recommendations.append("Continue maintaining your excellent service standards.")
        
        result = {
            "driver_id": driver_id,
            "driver_name": driver["name"],
            "sentiment_score": round(sentiment_score, 1),
            "skill_analysis": {k: round(v, 1) for k, v in skill_scores.items()},
            "insights": insights,
            "recommendations": recommendations
        }
        
        return result

# Initialize the model
nlp_model = SimpleNLPModel()

@app.route('/api/analyze', methods=['POST'])
def analyze_review():
    data = request.json
    if not data or 'review' not in data or 'driver_id' not in data:
        return jsonify({"error": "Missing required fields: review and driver_id"}), 400
    
    review_text = data['review']
    driver_id = int(data['driver_id'])
    
    result = nlp_model.analyze_text(review_text, driver_id)
    return jsonify(result)

@app.route('/api/generate-review', methods=['POST'])
def generate_review():
    data = request.json
    if not data or 'driver_id' not in data:
        return jsonify({"error": "Missing required field: driver_id"}), 400
    
    driver_id = int(data['driver_id'])
    driver = nlp_model.driver_info.get(driver_id, {"name": "Unknown Driver", "experience": 0})
    
    # Generate simulated AI review based on driver info
    experience_phrases = [
        f"The driver has {driver['experience']} years of experience which shows in their driving style.",
        f"With {driver['experience']} years on the road, {driver['name']} handles the vehicle confidently.",
        f"{driver['name']}'s {driver['experience']} years of experience translates to a smooth ride."
    ]
    
    skill_phrases = [
        "Their communication was clear and timely.",
        "The vehicle was well-maintained and clean.",
        "Punctuality was excellent, arriving right on schedule.",
        "The driving was smooth and comfortable throughout the journey.",
        "Very professional attitude and appearance."
    ]
    
    # Randomly select phrases
    np.random.seed(driver_id)  # For reproducibility
    experience_comment = np.random.choice(experience_phrases)
    selected_skills = np.random.choice(skill_phrases, size=min(3, len(skill_phrases)), replace=False)
    
    ai_review = f"{experience_comment} {' '.join(selected_skills)}"
    
    return jsonify({
        "driver_id": driver_id,
        "driver_name": driver["name"],
        "ai_generated_review": ai_review
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)