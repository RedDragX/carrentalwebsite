import { useState, ChangeEvent } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface AIDriverReviewProps {
  driverId: number;
  driverName: string;
}

interface SkillAnalysis {
  driving_skill: number;
  communication: number;
  punctuality: number;
  professionalism: number;
  vehicle_condition: number;
}

interface NLPResult {
  driver_id: number;
  driver_name: string;
  sentiment_score: number;
  skill_analysis: SkillAnalysis;
  insights: string[];
  recommendations: string[];
}

interface AIGeneratedReview {
  driver_id: number;
  driver_name: string;
  ai_generated_review: string;
}

const AIDriverReview = ({ driverId, driverName }: AIDriverReviewProps) => {
  const [reviewText, setReviewText] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch AI-generated review
  const { 
    data: aiGeneratedReview,
    isLoading: isGeneratedReviewLoading,
    error: generatedReviewError,
    refetch: refetchAIReview
  } = useQuery<AIGeneratedReview>({
    queryKey: [`/api/ai/generate-review/${driverId}`],
    enabled: !!driverId
  });

  // Analyze review mutation
  const analyzeMutation = useMutation({
    mutationFn: async ({ review, driverId }: { review: string; driverId: number }) => {
      return apiRequest("POST", `/api/ai/analyze-review`, { review, driverId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/ai/analyze-review`] });
      toast({
        title: "Review Analysis Complete",
        description: "Your review has been analyzed by our AI system.",
      });
      setReviewText("");
    },
    onError: () => {
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing your review. Please try again.",
        variant: "destructive"
      });
    }
  });

  const [analysisResult, setAnalysisResult] = useState<NLPResult | null>(null);

  const handleSubmitReview = async () => {
    if (!reviewText.trim()) {
      toast({
        title: "Review Required",
        description: "Please enter a review to analyze.",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await analyzeMutation.mutateAsync({ review: reviewText, driverId });
      const result = await response.json();
      setAnalysisResult(result as NLPResult);
    } catch (error) {
      console.error("Error analyzing review:", error);
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing your review. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleGenerateNewReview = () => {
    refetchAIReview();
  };

  // Format a skill name for display
  const formatSkillName = (key: string): string => {
    return key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="space-y-8">
      <div className="glass-card p-0.5 overflow-hidden">
        <div className="glass-dark p-6 rounded-xl h-full">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-white bg-gradient-to-r from-accent to-blue-500 bg-clip-text text-transparent mb-2">AI Driver Analysis</h3>
            <p className="text-gray-300">
              Our AI system analyzes driver performance using natural language processing. Enter your review
              below or get an AI-generated review to see insights about this driver.
            </p>
          </div>
          <div className="mb-6">
            <label htmlFor="review" className="block text-sm font-medium mb-2 text-gray-200">
              Your Review of {driverName}
            </label>
            <Textarea
              id="review"
              value={reviewText}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setReviewText(e.target.value)}
              placeholder="Enter your review of the driver here..."
              className="w-full bg-gray-800/80 border-gray-700 text-white placeholder:text-gray-400 focus:border-accent"
              rows={4}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleSubmitReview}
              disabled={analyzeMutation.isPending || !reviewText.trim()}
              className="bg-gradient-to-r from-accent to-blue-500 hover:from-accent/90 hover:to-blue-600 text-white"
            >
              {analyzeMutation.isPending ? "Analyzing..." : "Analyze Review"}
            </Button>
            <Button
              onClick={handleGenerateNewReview}
              variant="outline"
              disabled={isGeneratedReviewLoading}
              className="border-accent text-accent hover:bg-accent/10 hover:text-white"
            >
              {isGeneratedReviewLoading ? "Generating..." : "Generate AI Review"}
            </Button>
          </div>
        </div>
      </div>

      {/* AI-Generated Review Card */}
      {aiGeneratedReview && (
        <div className="glass-card gradient-border p-0.5 overflow-hidden relative">
          <div className="glass-dark p-6 rounded-xl h-full">
            <div className="absolute top-3 right-3 bg-gradient-to-r from-blue-600 to-accent text-white text-xs px-3 py-1 rounded-full">
              AI-Generated
            </div>
            <div className="mb-6 mt-2">
              <h3 className="text-xl font-bold text-white bg-gradient-to-r from-accent to-blue-500 bg-clip-text text-transparent mb-2">AI-Generated Review</h3>
              <p className="text-gray-300">
                This is an AI-generated review based on this driver's profile and experience.
              </p>
            </div>
            <div className="glass-panel p-4 rounded-lg mb-6">
              <p className="italic text-gray-200">{String(aiGeneratedReview.ai_generated_review)}</p>
            </div>
            <Button
              onClick={handleGenerateNewReview}
              variant="outline"
              size="sm"
              className="border-accent text-accent hover:bg-accent/20 hover:text-white"
            >
              Generate Another Review
            </Button>
          </div>
        </div>
      )}

      {/* Analysis Result Card */}
      {analysisResult && (
        <div className="glass-card glow-effect p-0.5 overflow-hidden">
          <div className="glass-dark p-6 rounded-xl h-full">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white bg-gradient-to-r from-accent to-blue-500 bg-clip-text text-transparent mb-2">Review Analysis Results</h3>
              <p className="text-gray-300">
                Our AI has analyzed your review of {analysisResult.driver_name}
              </p>
            </div>
            <div className="space-y-6">
              {/* Overall Sentiment */}
              <div className="glass-panel p-4 rounded-lg">
                <h4 className="font-medium text-white mb-3">Overall Sentiment</h4>
                <div className="flex items-center">
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div 
                      className="progress-bar-glow h-2.5 rounded-full" 
                      style={{ width: `${(analysisResult.sentiment_score / 5) * 100}%` }}
                    ></div>
                  </div>
                  <span className="ml-3 font-medium text-white">{analysisResult.sentiment_score}/5</span>
                </div>
              </div>

              {/* Skill Analysis */}
              <div className="glass-panel p-4 rounded-lg">
                <h4 className="font-medium text-white mb-3">Skill Analysis</h4>
                <div className="space-y-4">
                  {Object.entries(analysisResult.skill_analysis).map(([skill, score]) => (
                    <div key={skill}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-300">{formatSkillName(skill)}</span>
                        <span className="text-sm font-medium text-white">{score}/5</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            score >= 4 ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 
                            score >= 3 ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 
                            'bg-gradient-to-r from-red-500 to-rose-500'
                          }`}
                          style={{ width: `${(score / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Insights and Recommendations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Insights */}
                <div className="glass-panel p-4 rounded-lg">
                  <h4 className="font-medium text-white mb-3">AI Insights</h4>
                  <ul className="list-disc pl-5 space-y-2 text-gray-300">
                    {analysisResult.insights.map((insight, index) => (
                      <li key={index}>{insight}</li>
                    ))}
                  </ul>
                </div>

                {/* Recommendations */}
                <div className="glass-panel p-4 rounded-lg">
                  <h4 className="font-medium text-white mb-3">Recommendations</h4>
                  <ul className="list-disc pl-5 space-y-2 text-gray-300">
                    {analysisResult.recommendations.map((recommendation, index) => (
                      <li key={index}>{recommendation}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIDriverReview;