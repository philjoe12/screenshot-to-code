import React from 'react';
import { FeatureType, getCreditCost, getFeatureInfo } from '../../config/credit-usage';

interface CreditCostBadgeProps {
  featureType: FeatureType;
  className?: string;
  showTooltip?: boolean;
}

const CreditCostBadge: React.FC<CreditCostBadgeProps> = ({ 
  featureType, 
  className = '',
  showTooltip = true 
}) => {
  const cost = getCreditCost(featureType);
  const info = getFeatureInfo(featureType);
  
  const getColorClass = () => {
    if (cost <= 1) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    if (cost <= 3) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    if (cost <= 5) return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <span 
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getColorClass()}`}
        title={showTooltip ? `${info.description} - ${info.processingTimeEstimate}` : undefined}
      >
        {cost} credit{cost > 1 ? 's' : ''}
      </span>
    </div>
  );
};

export default CreditCostBadge;