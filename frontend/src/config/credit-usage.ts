// Credit Usage Configuration for Frontend
// This should match the backend credit_usage.py configuration

export interface CreditUsageInfo {
  baseCredits: number;
  description: string;
  complexityLevel: 'Low' | 'Medium' | 'High' | 'Very High';
  aiModelsUsed: string[];
  processingTimeEstimate: string;
  icon?: string;
}

export enum FeatureType {
  // Code Generation Features
  CODE_GENERATION_TEXT = 'code_generation_text',
  CODE_GENERATION_IMAGE = 'code_generation_image',
  CODE_GENERATION_VIDEO = 'code_generation_video',
  CODE_GENERATION_UPDATE = 'code_generation_update',
  
  // Video Processing Features
  VIDEO_TO_SCENE_GRAPH = 'video_to_scene_graph',
  WEBPAGE_TO_VIDEO = 'webpage_to_video',
  IMAGES_TO_VIDEO = 'images_to_video',
  
  // Screenshot Features
  URL_SCREENSHOT = 'url_screenshot',
  
  // Future Features
  BATCH_PROCESSING = 'batch_processing',
  API_ACCESS = 'api_access',
}

export const CREDIT_USAGE: Record<FeatureType, CreditUsageInfo> = {
  [FeatureType.CODE_GENERATION_TEXT]: {
    baseCredits: 1,
    description: 'Generate code from text description',
    complexityLevel: 'Low',
    aiModelsUsed: ['Claude-4-Sonnet', 'GPT-4', 'Claude-3.7-Sonnet'],
    processingTimeEstimate: '10-30 seconds',
    icon: '✍️'
  },
  
  [FeatureType.CODE_GENERATION_IMAGE]: {
    baseCredits: 2,
    description: 'Generate code from screenshot/image',
    complexityLevel: 'Medium',
    aiModelsUsed: ['Claude-3.7-Sonnet', 'GPT-4-Vision', 'Gemini-2.0-Flash'],
    processingTimeEstimate: '20-60 seconds',
    icon: '📸'
  },
  
  [FeatureType.CODE_GENERATION_VIDEO]: {
    baseCredits: 5,
    description: 'Generate code from video recording',
    complexityLevel: 'High',
    aiModelsUsed: ['Claude-3-Opus'],
    processingTimeEstimate: '60-180 seconds',
    icon: '🎥'
  },
  
  [FeatureType.CODE_GENERATION_UPDATE]: {
    baseCredits: 1,
    description: 'Update existing code with modifications',
    complexityLevel: 'Low',
    aiModelsUsed: ['Claude-4-Sonnet', 'GPT-4'],
    processingTimeEstimate: '10-30 seconds',
    icon: '🔄'
  },
  
  [FeatureType.VIDEO_TO_SCENE_GRAPH]: {
    baseCredits: 3,
    description: 'Extract scene graph and objects from video',
    complexityLevel: 'High',
    aiModelsUsed: ['Replicate-YOLO', 'Frame-Extraction'],
    processingTimeEstimate: '30-90 seconds',
    icon: '🎬'
  },
  
  [FeatureType.WEBPAGE_TO_VIDEO]: {
    baseCredits: 8,
    description: 'Convert webpage to video presentation',
    complexityLevel: 'Very High',
    aiModelsUsed: ['GPT-4', 'DALL-E', 'Text-to-Speech'],
    processingTimeEstimate: '120-300 seconds',
    icon: '🌐'
  },
  
  [FeatureType.IMAGES_TO_VIDEO]: {
    baseCredits: 2,
    description: 'Create video from multiple images',
    complexityLevel: 'Medium',
    aiModelsUsed: ['OpenCV-Video-Processing'],
    processingTimeEstimate: '30-90 seconds',
    icon: '🖼️'
  },
  
  [FeatureType.URL_SCREENSHOT]: {
    baseCredits: 1,
    description: 'Capture screenshot from URL',
    complexityLevel: 'Low',
    aiModelsUsed: ['ScreenshotOne-API'],
    processingTimeEstimate: '5-15 seconds',
    icon: '📷'
  },
  
  [FeatureType.BATCH_PROCESSING]: {
    baseCredits: 1,
    description: 'Process multiple items in batch (per item)',
    complexityLevel: 'Medium',
    aiModelsUsed: ['Depends on batch type'],
    processingTimeEstimate: 'Variable',
    icon: '📦'
  },
  
  [FeatureType.API_ACCESS]: {
    baseCredits: 1,
    description: 'API access to features (per call)',
    complexityLevel: 'Low',
    aiModelsUsed: ['Same as feature'],
    processingTimeEstimate: 'Variable',
    icon: '🔌'
  },
};

// Feature availability by plan
export const PLAN_FEATURES = {
  free: [
    FeatureType.CODE_GENERATION_TEXT,
    FeatureType.CODE_GENERATION_IMAGE,
    FeatureType.URL_SCREENSHOT,
  ],
  starter: [
    FeatureType.CODE_GENERATION_TEXT,
    FeatureType.CODE_GENERATION_IMAGE,
    FeatureType.CODE_GENERATION_UPDATE,
    FeatureType.URL_SCREENSHOT,
    FeatureType.IMAGES_TO_VIDEO,
  ],
  basic: [
    FeatureType.CODE_GENERATION_TEXT,
    FeatureType.CODE_GENERATION_IMAGE,
    FeatureType.CODE_GENERATION_VIDEO,
    FeatureType.CODE_GENERATION_UPDATE,
    FeatureType.URL_SCREENSHOT,
    FeatureType.IMAGES_TO_VIDEO,
    FeatureType.VIDEO_TO_SCENE_GRAPH,
  ],
  professional: Object.values(FeatureType),
  enterprise: Object.values(FeatureType),
};

// Credit multipliers for different conditions
export const CREDIT_MULTIPLIERS = {
  priorityProcessing: 1.5,
  largeFileSize: 1.2,
  complexFramework: 1.1,
  multipleIterations: 0.8,
};

// Free tier limitations
export const FREE_TIER_LIMITS = {
  maxFileSizeMB: 5,
  maxVideoDurationSeconds: 60,
  maxBatchSize: 3,
  priorityProcessing: false,
};

// Helper functions
export const getCreditCost = (featureType: FeatureType): number => {
  return CREDIT_USAGE[featureType]?.baseCredits || 1;
};

export const getFeatureInfo = (featureType: FeatureType): CreditUsageInfo => {
  return CREDIT_USAGE[featureType];
};

export const isFeatureAvailable = (featureType: FeatureType, plan: string): boolean => {
  const planFeatures = PLAN_FEATURES[plan as keyof typeof PLAN_FEATURES] || [];
  return planFeatures.includes(featureType);
};

export const calculateDynamicCost = (
  featureType: FeatureType,
  options: {
    priority?: boolean;
    fileSizeMB?: number;
    framework?: string;
    isIteration?: boolean;
  } = {}
): number => {
  const baseCost = getCreditCost(featureType);
  let multiplier = 1.0;
  
  if (options.priority) {
    multiplier *= CREDIT_MULTIPLIERS.priorityProcessing;
  }
  
  if (options.fileSizeMB && options.fileSizeMB > 10) {
    multiplier *= CREDIT_MULTIPLIERS.largeFileSize;
  }
  
  if (options.framework && ['React Native', 'Flutter', 'Angular'].includes(options.framework)) {
    multiplier *= CREDIT_MULTIPLIERS.complexFramework;
  }
  
  if (options.isIteration) {
    multiplier *= CREDIT_MULTIPLIERS.multipleIterations;
  }
  
  return Math.ceil(baseCost * multiplier);
};

export const getComplexityColor = (complexity: CreditUsageInfo['complexityLevel']): string => {
  switch (complexity) {
    case 'Low': return 'text-green-600 bg-green-50';
    case 'Medium': return 'text-yellow-600 bg-yellow-50';
    case 'High': return 'text-orange-600 bg-orange-50';
    case 'Very High': return 'text-red-600 bg-red-50';
    default: return 'text-gray-600 bg-gray-50';
  }
};

export const formatProcessingTime = (time: string): string => {
  return time.replace('-', ' - ');
};

// Usage examples for documentation
export const USAGE_EXAMPLES = {
  [FeatureType.CODE_GENERATION_TEXT]: {
    example: 'Create a React login form with email and password fields',
    expectedCredits: 1,
  },
  [FeatureType.CODE_GENERATION_IMAGE]: {
    example: 'Convert a screenshot of a dashboard to React components',
    expectedCredits: 2,
  },
  [FeatureType.CODE_GENERATION_VIDEO]: {
    example: 'Generate code from a screen recording of user interactions',
    expectedCredits: 5,
  },
  [FeatureType.WEBPAGE_TO_VIDEO]: {
    example: 'Convert a blog post into a video presentation',
    expectedCredits: 8,
  },
};