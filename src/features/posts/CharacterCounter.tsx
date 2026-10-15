import React from 'react';
import { SocialPlatform } from '../../types/post';
import { validateCharacterLimits } from '../../lib/validation';
import { PlatformIcon } from '../../components/PlatformIcon';
import { PLATFORM_CONFIG } from '../../lib/platformConfig';
import { AlertCircle } from 'lucide-react';

interface CharacterCounterProps {
  content: string;
  selectedPlatforms: SocialPlatform[];
}

export const CharacterCounter: React.FC<CharacterCounterProps> = ({
  content,
  selectedPlatforms,
}) => {
  if (selectedPlatforms.length === 0) {
    return null;
  }

  const validationMap = validateCharacterLimits(content, selectedPlatforms);

  const exceededPlatforms = selectedPlatforms.filter(
    (platform) => !validationMap[platform].isValid
  );

  return (
    <div className="space-y-3 pt-2">
      {/* Platform counter badges */}
      <div className="flex items-center gap-2.5 flex-wrap">
        {selectedPlatforms.map((platform) => {
          const detail = validationMap[platform];
          const config = PLATFORM_CONFIG[platform];
          const isExceeded = !detail.isValid;
          const isWarning = detail.isWarning;

          let badgeStyles = 'bg-slate-50 text-slate-700 border-slate-200';
          let countStyles = 'text-slate-600 font-medium';

          if (isExceeded) {
            badgeStyles = 'bg-rose-50 text-rose-700 border-rose-300 ring-1 ring-rose-300';
            countStyles = 'text-rose-700 font-bold';
          } else if (isWarning) {
            badgeStyles = 'bg-amber-50 text-amber-800 border-amber-300';
            countStyles = 'text-amber-700 font-semibold';
          }

          return (
            <div
              key={platform}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs transition-all shadow-2xs ${badgeStyles}`}
            >
              <PlatformIcon platform={platform} size="sm" />
              <span className="font-semibold text-slate-800">{config.label}:</span>
              <span className={countStyles}>
                {detail.count} / {detail.limit}
              </span>
              {isExceeded && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 ml-0.5">
                  ({Math.abs(detail.remaining)} over)
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Warning message if any platform exceeds limit */}
      {exceededPlatforms.length > 0 && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 animate-shake">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>
            Content exceeds the maximum character limit for{' '}
            <strong>
              {exceededPlatforms
                .map((p) => PLATFORM_CONFIG[p].label)
                .join(', ')}
            </strong>
            . Please shorten your post to schedule.
          </span>
        </div>
      )}
    </div>
  );
};
