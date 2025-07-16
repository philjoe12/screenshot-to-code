-- Add new fields to conversion_history table for feature-specific credit tracking
ALTER TABLE conversion_history ADD COLUMN IF NOT EXISTS feature_type TEXT;
ALTER TABLE conversion_history ADD COLUMN IF NOT EXISTS credits_used INTEGER DEFAULT 1;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_conversion_history_feature_type ON conversion_history(feature_type);
CREATE INDEX IF NOT EXISTS idx_conversion_history_credits_used ON conversion_history(credits_used);

-- Add check constraint to ensure credits_used is positive
ALTER TABLE conversion_history ADD CONSTRAINT IF NOT EXISTS chk_credits_used_positive CHECK (credits_used > 0);

-- Update existing records to have feature_type based on input_type
UPDATE conversion_history 
SET feature_type = CASE 
    WHEN input_type = 'image' THEN 'code_generation_image'
    WHEN input_type = 'video' THEN 'code_generation_video'
    WHEN input_type = 'text' THEN 'code_generation_text'
    ELSE 'code_generation_image'
END
WHERE feature_type IS NULL;

-- Make feature_type NOT NULL after populating existing records
ALTER TABLE conversion_history ALTER COLUMN feature_type SET NOT NULL;