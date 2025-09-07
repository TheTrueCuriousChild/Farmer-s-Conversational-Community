
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, Camera, Bug, AlertTriangle, CheckCircle } from "lucide-react";

export default function Disease() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const commonDiseases = [
    {
      name: "Leaf Blight",
      crop: "Rice",
      severity: "High",
      symptoms: "Brown spots on leaves, yellowing",
      treatment: "Apply copper fungicide, improve drainage"
    },
    {
      name: "Powdery Mildew",
      crop: "Wheat",
      severity: "Medium",
      symptoms: "White powdery coating on leaves",
      treatment: "Apply sulfur-based fungicide, increase air circulation"
    },
    {
      name: "Bacterial Wilt",
      crop: "Tomato",
      severity: "High",
      symptoms: "Wilting, yellowing leaves, stunted growth",
      treatment: "Remove infected plants, crop rotation, resistant varieties"
    },
    {
      name: "Aphid Infestation",
      crop: "Cotton",
      severity: "Low",
      symptoms: "Small green insects on leaves, sticky honeydew",
      treatment: "Apply neem oil, introduce beneficial insects"
    }
  ];

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
        setAnalysis(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeDisease = () => {
    if (!selectedImage) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      setAnalysis({
        disease: "Late Blight",
        confidence: 87,
        crop: "Tomato",
        severity: "Medium",
        symptoms: "Dark spots on leaves with white fuzzy growth underneath",
        treatment: "Apply copper-based fungicide every 7-10 days. Remove affected leaves. Improve air circulation.",
        prevention: "Avoid overhead watering, space plants properly, apply mulch to prevent soil splash."
      });
      setIsAnalyzing(false);
    }, 3000);
  };

  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return 'text-red-600 bg-red-100 dark:text-red-300 dark:bg-red-900/50';
      case 'medium':
        return 'text-orange-600 bg-orange-100 dark:text-orange-300 dark:bg-orange-900/50';
      case 'low':
        return 'text-green-600 bg-green-100 dark:text-green-300 dark:bg-green-900/50';
      default:
        return 'text-gray-600 bg-gray-100 dark:text-gray-300 dark:bg-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-950 min-h-full">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Disease Detection</h1>
        <p className="text-gray-600 dark:text-gray-400">Upload plant images for AI-powered disease identification</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Image Upload Section */}
        <Card className="dark:bg-gray-900 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 dark:text-white">
              <Camera className="w-5 h-5" />
              Upload Plant Image
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Upload Area */}
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-green-500 dark:hover:border-green-400 transition-colors">
                {selectedImage ? (
                  <div>
                    <img 
                      src={selectedImage} 
                      alt="Selected plant" 
                      className="max-w-full h-48 object-cover mx-auto rounded-lg mb-4"
                    />
                    <p className="text-gray-600 dark:text-gray-400">Image selected successfully</p>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 mb-2">Click to upload or drag and drop</p>
                    <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                  </div>
                )}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="mt-4"
                />
              </div>

              <Button 
                onClick={analyzeDisease} 
                disabled={!selectedImage || isAnalyzing}
                className="w-full"
              >
                {isAnalyzing ? "Analyzing..." : "Analyze Disease"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Analysis Results */}
        <Card className="dark:bg-gray-900 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 dark:text-white">
              <Bug className="w-5 h-5" />
              Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analysis ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{analysis.disease}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(analysis.severity)}`}>
                    {analysis.severity}
                  </span>
                </div>
                
                <div className="bg-green-50 dark:bg-green-900/50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
                    <span className="font-semibold dark:text-gray-200">Confidence: {analysis.confidence}%</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">Crop: {analysis.crop}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 dark:text-white">Symptoms:</h4>
                  <p className="text-gray-700 dark:text-gray-300">{analysis.symptoms}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 dark:text-white">Treatment:</h4>
                  <p className="text-gray-700 dark:text-gray-300">{analysis.treatment}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 dark:text-white">Prevention:</h4>
                  <p className="text-gray-700 dark:text-gray-300">{analysis.prevention}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Bug className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">Upload an image to get disease analysis results</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Common Diseases */}
      <Card className="dark:bg-gray-900 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 dark:text-white">
            <AlertTriangle className="w-5 h-5" />
            Common Diseases
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {commonDiseases.map((disease, index) => (
              <div key={index} className="border dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{disease.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(disease.severity)}`}>
                    {disease.severity}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Crop:</span>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">{disease.crop}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Symptoms:</span>
                    <p className="text-gray-600 dark:text-gray-400">{disease.symptoms}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Treatment:</span>
                    <p className="text-gray-600 dark:text-gray-400">{disease.treatment}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
