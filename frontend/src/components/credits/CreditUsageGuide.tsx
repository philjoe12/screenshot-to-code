import React, { useState } from 'react';
import { 
  CREDIT_USAGE, 
  FeatureType, 
  getCreditCost, 
  getFeatureInfo, 
  getComplexityColor,
  formatProcessingTime,
  USAGE_EXAMPLES,
  PLAN_FEATURES
} from '../../config/credit-usage';
import { formatCredits } from '../../config/pricing';

interface CreditUsageGuideProps {
  userPlan?: string;
  showOnlyAvailableFeatures?: boolean;
}

const CreditUsageGuide: React.FC<CreditUsageGuideProps> = ({ 
  userPlan = 'free', 
  showOnlyAvailableFeatures = false 
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'generation' | 'video' | 'utilities'>('all');
  const [expandedFeature, setExpandedFeature] = useState<FeatureType | null>(null);

  const categorizeFeatures = () => {
    const features = Object.values(FeatureType);
    const availableFeatures = showOnlyAvailableFeatures 
      ? features.filter(feature => PLAN_FEATURES[userPlan as keyof typeof PLAN_FEATURES]?.includes(feature))
      : features;

    return {
      all: availableFeatures,
      generation: availableFeatures.filter(f => f.includes('code_generation')),
      video: availableFeatures.filter(f => f.includes('video') || f.includes('images_to_video')),
      utilities: availableFeatures.filter(f => f.includes('screenshot') || f.includes('batch') || f.includes('api'))
    };
  };

  const categories = categorizeFeatures();
  const displayFeatures = categories[selectedCategory];

  const FeatureCard = ({ featureType }: { featureType: FeatureType }) => {
    const info = getFeatureInfo(featureType);
    const isExpanded = expandedFeature === featureType;
    const example = USAGE_EXAMPLES[featureType];
    const isAvailable = PLAN_FEATURES[userPlan as keyof typeof PLAN_FEATURES]?.includes(featureType);

    return (
      <div className={`border rounded-lg p-4 ${isAvailable ? 'bg-white' : 'bg-gray-50 opacity-60'}`}>
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setExpandedFeature(isExpanded ? null : featureType)}
        >
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{info.icon}</span>
            <div>
              <h3 className="font-semibold text-gray-900">{info.description}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-lg font-bold text-blue-600">
                  {formatCredits(info.baseCredits)} credit{info.baseCredits > 1 ? 's' : ''}
                </span>
                <span className={`px-2 py-1 text-xs rounded-full ${getComplexityColor(info.complexityLevel)}`}>
                  {info.complexityLevel}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {!isAvailable && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                Not available in {userPlan} plan
              </span>
            )}
            <svg 
              className={`w-5 h-5 text-gray-400 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 space-y-3 border-t pt-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Processing Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Processing Time:</span>
                  <span className="ml-2 text-gray-600">{formatProcessingTime(info.processingTimeEstimate)}</span>
                </div>
                <div>
                  <span className="font-medium">Complexity:</span>
                  <span className="ml-2 text-gray-600">{info.complexityLevel}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-700 mb-2">AI Models Used</h4>
              <div className="flex flex-wrap gap-2">
                {info.aiModelsUsed.map((model, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    {model}
                  </span>
                ))}
              </div>
            </div>

            {example && (
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Example Usage</h4>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-600 italic">"{example.example}"</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Expected cost: {formatCredits(example.expectedCredits)} credit{example.expectedCredits > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Credit Usage Guide</h2>
        <p className="text-gray-600">
          Understand how credits are consumed for different features. Credit costs reflect the computational 
          complexity and AI model usage for each feature.
        </p>
      </div>

      {/* Category Filters */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'all', label: 'All Features', count: categories.all.length },
            { key: 'generation', label: 'Code Generation', count: categories.generation.length },
            { key: 'video', label: 'Video Processing', count: categories.video.length },
            { key: 'utilities', label: 'Utilities', count: categories.utilities.length }
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {label} ({count})
            </button>
          ))}
        </div>
      </div>

      {/* Plan Badge */}
      {userPlan && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <span className="font-medium">Your Plan:</span> {userPlan.charAt(0).toUpperCase() + userPlan.slice(1)}
            {showOnlyAvailableFeatures && (
              <span className="ml-2 text-xs text-blue-600">
                (Showing only available features)
              </span>
            )}
          </p>
        </div>
      )}

      {/* Features List */}
      <div className="space-y-4">
        {displayFeatures.map((featureType) => (
          <FeatureCard key={featureType} featureType={featureType} />
        ))}
      </div>

      {displayFeatures.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No features available for the selected category.</p>
        </div>
      )}

      {/* Cost Summary */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-2">Cost Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="font-medium text-green-600">Low Complexity:</span>
            <span className="ml-2">1 credit</span>
          </div>
          <div>
            <span className="font-medium text-yellow-600">Medium Complexity:</span>
            <span className="ml-2">2-3 credits</span>
          </div>
          <div>
            <span className="font-medium text-orange-600">High Complexity:</span>
            <span className="ml-2">5 credits</span>
          </div>
          <div>
            <span className="font-medium text-red-600">Very High Complexity:</span>
            <span className="ml-2">8+ credits</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          * Costs may vary based on file size, processing priority, and framework complexity
        </p>
      </div>
    </div>
  );
};

export default CreditUsageGuide;