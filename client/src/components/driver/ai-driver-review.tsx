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
  } = useQuery({
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
      <Card className="bg-white/70 backdrop-blur-sm border-accent/20">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">AI Driver Analysis</CardTitle>
          <CardDescription>
            Our AI system analyzes driver performance using natural language processing. Enter your review
            below or get an AI-generated review to see insights about this driver.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <label htmlFor="review" className="block text-sm font-medium mb-2">
              Your Review of {driverName}
            </label>
            <Textarea
              id="review"
              value={reviewText}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setReviewText(e.target.value)}
              placeholder="Enter your review of the driver here..."
              className="w-full"
              rows={4}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleSubmitReview}
              disabled={analyzeMutation.isPending || !reviewText.trim()}
              className="bg-accent hover:bg-accent-dark text-white"
            >
              {analyzeMutation.isPending ? "Analyzing..." : "Analyze Review"}
            </Button>
            <Button
              onClick={handleGenerateNewReview}
              variant="outline"
              disabled={isGeneratedReviewLoading}
              className="border-accent text-accent hover:bg-accent/10"
            >
              {isGeneratedReviewLoading ? "Generating..." : "Generate AI Review"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AI-Generated Review Card */}
      {aiGeneratedReview && typeof aiGeneratedReview === 'object' && 'ai_generated_review' in aiGeneratedReview && (
        <Card className="bg-gradient-to-br from-accent/10 to-accent/5 backdrop-blur-sm border-accent/20 overflow-hidden relative">
          <div className="absolute top-3 right-3 bg-accent/90 text-white text-xs px-2 py-1 rounded-full">
            AI-Generated
          </div>
          <CardHeader>
            <CardTitle className="text-xl font-bold text-primary">AI-Generated Review</CardTitle>
            <CardDescription>
              This is an AI-generated review based on this driver's profile and experience.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-white/60 p-4 rounded-lg">
              <p className="italic text-neutral-800">{String(aiGeneratedReview.ai_generated_review)}</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleGenerateNewReview}
              variant="outline"
              size="sm"
              className="border-accent text-accent hover:bg-accent/10"
            >
              Generate Another Review
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Analysis Result Card */}
      {analysisResult && (
        <Card className="bg-white/70 backdrop-blur-sm border-primary/10">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-primary">Review Analysis Results</CardTitle>
            <CardDescription>
              Our AI has analyzed your review of {analysisResult.driver_name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Overall Sentiment */}
              <div>
                <h4 className="font-medium text-primary mb-2">Overall Sentiment</h4>
                <div className="flex items-center">
                  <div className="w-full bg-neutral-200 rounded-full h-2.5">
                    <div 
                      className="bg-accent h-2.5 rounded-full" 
                      style={{ width: `${(analysisResult.sentiment_score / 5) * 100}%` }}
                    ></div>
                  </div>
                  <span className="ml-3 font-medium">{analysisResult.sentiment_score}/5</span>
                </div>
              </div>

              {/* Skill Analysis */}
              <div>
                <h4 className="font-medium text-primary mb-2">Skill Analysis</h4>
                <div className="space-y-3">
                  {Object.entries(analysisResult.skill_analysis).map(([skill, score]) => (
                    <div key={skill}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">{formatSkillName(skill)}</span>
                        <span className="text-sm font-medium">{score}/5</span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            score >= 4 ? 'bg-green-500' : 
                            score >= 3 ? 'bg-accent' : 
                            'bg-red-500'
                          }`}
                          style={{ width: `${(score / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Insights */}
              <div>
                <h4 className="font-medium text-primary mb-2">AI Insights</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {analysisResult.insights.map((insight, index) => (
                    <li key={index} className="text-neutral-700">{insight}</li>
                  ))}
                </ul>
              </div>

              {/* Recommendations */}
              <div>
                <h4 className="font-medium text-primary mb-2">Recommendations</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {analysisResult.recommendations.map((recommendation, index) => (
                    <li key={index} className="text-neutral-700">{recommendation}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AIDriverReview;