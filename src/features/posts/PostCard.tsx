import React, { useState } from 'react';
import { SocialPost } from '../../types/post';
import { PlatformIcon } from '../../components/PlatformIcon';
import { StatusBadge } from '../../components/StatusBadge';
import { RetryButton } from '../retry/RetryButton';
import { formatLocalTime, formatLocalDateTime } from '../../lib/dateUtils';
import { Clock, Image as ImageIcon, Trash2, AlertTriangle, ChevronDown, ChevronUp, Pencil } from 'lucide-react';

interface PostCardProps {
  post: SocialPost;
  isRetrying: boolean;
  onRetry: (postId: string) => void;
  onDelete: (postId: string) => void;
  onEdit: (post: SocialPost) => void;
}

const CONTENT_PREVIEW_LIMIT = 180;

export const PostCard: React.FC<PostCardProps> = ({
  post,
  isRetrying,
  onRetry,
  onDelete,
  onEdit,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const isLongContent = post.content.length > CONTENT_PREVIEW_LIMIT;
  const displayContent = isLongContent && !isExpanded
    ? `${post.content.slice(0, CONTENT_PREVIEW_LIMIT).trim()}...`
    : post.content;

  const localTime = formatLocalTime(post.scheduledAt);
  const fullDateTime = formatLocalDateTime(post.scheduledAt);

  return (
    <article
      className={`group relative bg-white rounded-2xl border transition-all duration-200 shadow-card hover:shadow-card-hover flex flex-col justify-between overflow-hidden ${
        post.status === 'failed'
          ? 'border-rose-200/90 hover:border-rose-300 ring-1 ring-rose-50'
          : 'border-slate-200/80 hover:border-slate-300'
      }`}
      aria-label={`Post scheduled for ${fullDateTime}`}
    >
      <div className="p-5">
        {/* Card Header: Platforms & Status */}
        <div className="flex items-center justify-between gap-3 mb-3.5">
          {/* Platform icons row */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {post.platforms.map((platform) => (
              <span
                key={platform}
                className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center transition-colors hover:bg-slate-100"
              >
                <PlatformIcon platform={platform} size="sm" />
              </span>
            ))}
          </div>

          {/* Status badge */}
          <div className="flex items-center gap-2">
            <StatusBadge status={post.status} isRetrying={isRetrying} size="sm" />
          </div>
        </div>

        {/* Media Thumbnail Preview (if any) */}
        {post.mediaUrl && !imageError && (
          <div className="relative mb-3.5 rounded-xl overflow-hidden bg-slate-100 border border-slate-200/60 max-h-48 group/img">
            <img
              src={post.mediaUrl}
              alt="Post attachment"
              className="w-full h-36 sm:h-44 object-cover transition-transform duration-300 group-hover/img:scale-105"
              onError={() => setImageError(true)}
              loading="lazy"
            />
            <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-slate-900/70 backdrop-blur-xs text-white text-[10px] font-medium flex items-center gap-1">
              <ImageIcon className="w-3 h-3" />
              Attachment
            </div>
          </div>
        )}

        {/* Post Content */}
        <div className="space-y-1.5">
          <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-line break-words font-normal">
            {displayContent}
          </p>

          {isLongContent && (
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors pt-1 focus:outline-none"
            >
              {isExpanded ? (
                <>
                  <span>Show less</span>
                  <ChevronUp className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  <span>Read more</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          )}
        </div>

        {/* Error message banner (for failed status) */}
        {post.status === 'failed' && post.errorMessage && (
          <div className="mt-3.5 p-3 rounded-xl bg-rose-50/80 border border-rose-200/80 text-rose-800 text-xs flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-rose-900">Publishing Failed</p>
              <p className="text-rose-700 mt-0.5 leading-normal">{post.errorMessage}</p>
            </div>
          </div>
        )}
      </div>

      {/* Card Footer: Local Time & Actions */}
      <div className="px-5 py-3 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
        <div
          className="flex items-center gap-1.5 text-slate-500 font-medium"
          title={`Full schedule: ${fullDateTime}`}
        >
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>{localTime}</span>
          <span className="text-slate-300">•</span>
          <span className="text-[11px] text-slate-400">Local</span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {post.status === 'failed' && (
            <RetryButton
              postId={post.id}
              isRetrying={isRetrying}
              onRetry={onRetry}
              size="sm"
            />
          )}

          {(post.status === 'scheduled' || post.status === 'failed') && (
            <button
              type="button"
              onClick={() => onEdit(post)}
              title="Edit post content and schedule"
              aria-label="Edit post"
              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          )}

          {showConfirmDelete ? (
            <div className="flex items-center gap-1 bg-white border border-rose-200 rounded-lg p-0.5 shadow-xs">
              <button
                type="button"
                onClick={() => onDelete(post.id)}
                className="px-2 py-0.5 bg-rose-600 text-white text-[11px] font-medium rounded hover:bg-rose-700 transition-colors"
              >
                Delete
              </button>
              <button
                type="button"
                onClick={() => setShowConfirmDelete(false)}
                className="px-1.5 py-0.5 text-slate-600 text-[11px] hover:text-slate-900"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowConfirmDelete(true)}
              title="Delete post"
              aria-label="Delete post"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors focus:outline-none focus:ring-1 focus:ring-rose-500"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
