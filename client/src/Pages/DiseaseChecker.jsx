import React, { useState, useRef } from "react";
import { Camera, Upload, AlertCircle, CheckCircle, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { UploadFile, InvokeLLM } from "@/integrations/Core";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function DiseaseChecker() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedImage(file);
        setResults(null);
        setError(null);
      } else {
        setError("Please select a valid image file");
      }
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      // Upload the image
      const { file_url } = await UploadFile({ file: selectedImage });

      // Analyze the image for diseases
      const response = await InvokeLLM({
        prompt: `Analyze this crop/plant image for diseases or health issues. Provide:
        1. Disease identification (if any)
        2. Severity level (mild/moderate/severe)
        3. Confidence percentage
        4. Treatment recommendations
        5. Prevention tips
        6. Expected recovery time

        If the image shows a healthy plant, mention that. Be specific and practical in your advice.`,
        file_urls: [file_url],
        response_json_schema: {
          type: "object",
          properties: {
            disease_name: { type: "string" },
            is_healthy: { type: "boolean" },
            severity: { type: "string", enum: ["healthy", "mild", "moderate", "severe"] },
            confidence: { type: "number" },
            description: { type: "string" },
            treatment: { type: "array", items: { type: "string" } },
            prevention: { type: "array", items: { type: "string" } },
            recovery_time: { type: "string" }
          }
        }
      });

      setResults(response);
    } catch (error) {
      console.error("Error analyzing image:", error);
      setError("Failed to analyze the image. Please try again.");
    }

    setIsAnalyzing(false);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "healthy": return "bg-green-100 text-green-800";
      case "mild": return "bg-yellow-100 text-yellow-800";
      case "moderate": return "bg-orange-100 text-orange-800";
      case "severe": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                AI Disease Checker
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Upload crop photos for instant disease diagnosis
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-green-600" />
                  Upload Crop Image
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div
                  className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-green-500 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  
                  {selectedImage ? (
                    <div className="space-y-4">
                      <img
                        src={URL.createObjectURL(selectedImage)}
                        alt="Selected crop"
                        className="max-w-full h-48 object-cover rounded-lg mx-auto"
                      />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedImage.name}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                      <div>
                        <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                          Click to upload image
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          PNG, JPG, JPEG up to 10MB
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <Button
                  onClick={analyzeImage}
                  disabled={!selectedImage || isAnalyzing}
                  className="w-full gradient-green text-white hover:opacity-90"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing Image...
                    </>
                  ) : (
                    <>
                      <Camera className="w-4 h-4 mr-2" />
                      Analyze for Diseases
                    </>
                  )}
                </Button>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Results Section */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  Analysis Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!results && !isAnalyzing && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Camera className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">
                      Upload an image to see analysis results
                    </p>
                  </div>
                )}

                {isAnalyzing && (
                  <div className="text-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-green-600 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-300">
                      Analyzing your crop image...
                    </p>
                  </div>
                )}

                {results && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                  >
                    {/* Disease Status */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {results.is_healthy ? "Healthy Plant" : results.disease_name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          Confidence: {Math.round(results.confidence)}%
                        </p>
                      </div>
                      <Badge className={getSeverityColor(results.severity)}>
                        {results.severity}
                      </Badge>
                    </div>

                    {/* Description */}
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Description
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                        {results.description}
                      </p>
                    </div>

                    {/* Treatment */}
                    {results.treatment && results.treatment.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                          Treatment Recommendations
                        </h4>
                        <ul className="space-y-1">
                          {results.treatment.map((treatment, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-gray-600 dark:text-gray-300">{treatment}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Prevention */}
                    {results.prevention && results.prevention.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                          Prevention Tips
                        </h4>
                        <ul className="space-y-1">
                          {results.prevention.map((tip, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-gray-600 dark:text-gray-300">{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Recovery Time */}
                    {results.recovery_time && (
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                        <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-1">
                          Expected Recovery Time
                        </h4>
                        <p className="text-blue-700 dark:text-blue-400 text-sm">
                          {results.recovery_time}
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}