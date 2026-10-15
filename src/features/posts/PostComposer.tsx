import React, { useState, useEffect } from 'react';
import { SocialPlatform, SocialPost, CreatePostInput, UpdatePostInput } from '../../types/post';
import { ALL_PLATFORMS, PLATFORM_CONFIG } from '../../lib/platformConfig';
import { PlatformIcon } from '../../components/PlatformIcon';
import { CharacterCounter } from './CharacterCounter';
import {
  isContentValidForPlatforms,
  isFutureDate,
  isValidUrl,
} from '../../lib/validation';
import {
  toDatetimeLocalValue,
  localToUtcIso,
  getLocalTimeZone,
  parseUtcDate,
} from '../../lib/dateUtils';
import {
  X,
  Calendar,
  Image as ImageIcon,
  Check,
  AlertCircle,
  Loader2,
  Sparkles,
  Pencil,
} from 'lucide-react';

interface PostComposerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: CreatePostInput) => Promise<unknown>;
  initialPost?: SocialPost | null;
  onUpdate?: (postId: string, input: UpdatePostInput) => Promise<unknown>;
}

export const PostComposer: React.FC<PostComposerProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialPost,
  onUpdate,
}) => {
  const isEditMode = Boolean(initialPost);
  // Initial default scheduled time: 2 hours from now in local timezone
  const getInitialScheduleTime = () => {
    const d = new Date();
    d.setHours(d.getHours() + 2);
    d.setMinutes(0);
    d.setSeconds(0);
    return toDatetimeLocalValue(d);
  };

  const [content, setContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>([
    'x',
    'instagram',
  ]);
  const [mediaUrl, setMediaUrl] = useState('');
  const [scheduledAtLocal, setScheduledAtLocal] = useState(getInitialScheduleTime);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // Media preview states
  const [imagePreviewError, setImagePreviewError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Reset or pre-populate form when modal opens or initialPost changes
  useEffect(() => {
    if (isOpen) {
      if (initialPost) {
        setContent(initialPost.content);
        setSelectedPlatforms([...initialPost.platforms]);
        setMediaUrl(initialPost.mediaUrl || '');

        const parsedDate = parseUtcDate(initialPost.scheduledAt);
        if (isFutureDate(parsedDate)) {
          setScheduledAtLocal(toDatetimeLocalValue(parsedDate));
        } else {
          // If the post's schedule is in the past (e.g. for failed past posts), default to a future time
          setScheduledAtLocal(getInitialScheduleTime());
        }
      } else {
        setContent('');
        setSelectedPlatforms(['x', 'instagram']);
        setMediaUrl('');
        setScheduledAtLocal(getInitialScheduleTime());
      }
      setIsSubmitting(false);
      setSubmissionError(null);
      setImagePreviewError(false);
      setImageLoaded(false);
    }
  }, [isOpen, initialPost]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  const togglePlatform = (platform: SocialPlatform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  // Validation checks
  const isContentEmpty = !content.trim();
  const hasPlatforms = selectedPlatforms.length > 0;
  const isContentLengthValid = isContentValidForPlatforms(content, selectedPlatforms);
  const isUrlValid = isValidUrl(mediaUrl);
  
  // Future date check
  const selectedDateObj = new Date(scheduledAtLocal);
  const isDateInFuture = isFutureDate(selectedDateObj);

  const canSubmit =
    !isContentEmpty &&
    hasPlatforms &&
    isContentLengthValid &&
    isUrlValid &&
    isDateInFuture &&
    !isSubmitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionError(null);

    // Explicit validation check on submit
    if (isContentEmpty) {
      setSubmissionError('Post content cannot be empty.');
      return;
    }
    if (!hasPlatforms) {
      setSubmissionError('Please select at least one social media platform.');
      return;
    }
    if (!isContentLengthValid) {
      setSubmissionError('Content exceeds the character limit for one or more selected platforms.');
      return;
    }
    if (!isUrlValid) {
      setSubmissionError('Please enter a valid HTTP or HTTPS media URL.');
      return;
    }
    if (!isDateInFuture) {
      setSubmissionError('Scheduled time must be strictly in the future. Please pick a later time.');
      return;
    }

    try {
      setIsSubmitting(true);
      const utcTimestamp = localToUtcIso(scheduledAtLocal);

      if (isEditMode && initialPost && onUpdate) {
        await onUpdate(initialPost.id, {
          content: content.trim(),
          platforms: selectedPlatforms,
          mediaUrl: mediaUrl.trim() || undefined,
          scheduledAt: utcTimestamp,
        });
      } else {
        await onSubmit({
          content: content.trim(),
          platforms: selectedPlatforms,
          mediaUrl: mediaUrl.trim() || undefined,
          scheduledAt: utcTimestamp,
        });
      }

      onClose();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : isEditMode
          ? 'Failed to update post'
          : 'Failed to schedule post';
      setSubmissionError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="composer-modal-title"
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              {isEditMode ? <Pencil className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            </div>
            <div>
              <h2 id="composer-modal-title" className="text-base sm:text-lg font-bold text-slate-900">
                {isEditMode ? 'Edit Scheduled Post' : 'Create & Schedule Post'}
              </h2>
              <p className="text-xs text-slate-500">
                {isEditMode
                  ? 'Update content, target networks, or reschedule release time'
                  : 'Compose content for multiple social networks simultaneously'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close composer modal"
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Submission Error Banner */}
          {submissionError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <p className="font-medium">{submissionError}</p>
            </div>
          )}

          {/* Platform Selector Cards */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Select Publishing Networks <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {ALL_PLATFORMS.map((platform) => {
                const isSelected = selectedPlatforms.includes(platform);
                const config = PLATFORM_CONFIG[platform];

                return (
                  <button
                    key={platform}
                    type="button"
                    onClick={() => togglePlatform(platform)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/40 text-slate-900 ring-1 ring-indigo-500 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <PlatformIcon platform={platform} size="md" />
                      <span>{config.label}</span>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-md flex items-center justify-center border transition-colors ${
                        isSelected
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
            {!hasPlatforms && (
              <p className="text-xs text-rose-600 font-medium pt-0.5">
                Please select at least one destination platform.
              </p>
            )}
          </div>

          {/* Post Content Textarea */}
          <div className="space-y-1.5">
            <label htmlFor="post-content" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Post Content <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="post-content"
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's happening? Share product announcements, team updates, or creator tips..."
              className="w-full p-3.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none shadow-xs"
            />

            {/* Live Character Counters */}
            <CharacterCounter
              content={content}
              selectedPlatforms={selectedPlatforms}
            />
          </div>

          {/* Optional Media Image URL */}
          <div className="space-y-2">
            <label htmlFor="media-url" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Optional Media URL (Image)
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <input
                  id="media-url"
                  type="url"
                  value={mediaUrl}
                  onChange={(e) => {
                    setMediaUrl(e.target.value);
                    setImagePreviewError(false);
                    setImageLoaded(false);
                  }}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-xs"
                />
              </div>
              {mediaUrl && (
                <button
                  type="button"
                  onClick={() => {
                    setMediaUrl('');
                    setImagePreviewError(false);
                    setImageLoaded(false);
                  }}
                  className="px-3 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Image Preview Box */}
            {mediaUrl.trim() && (
              <div className="rounded-xl border border-slate-200 p-3 bg-slate-50/70">
                <p className="text-[11px] font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                  Attachment Preview
                </p>
                {imagePreviewError ? (
                  <div className="flex items-center gap-2 text-xs text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Unable to preview image. Please verify the URL points to a valid public image file.</span>
                  </div>
                ) : (
                  <div className="relative rounded-lg overflow-hidden bg-slate-200 max-h-48 flex items-center justify-center">
                    <img
                      src={mediaUrl}
                      alt="Attachment preview"
                      className="max-h-48 w-full object-cover"
                      onLoad={() => setImageLoaded(true)}
                      onError={() => setImagePreviewError(true)}
                    />
                    {!imageLoaded && (
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                        <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Schedule Date & Time */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="scheduled-at" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Schedule Date & Time <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-500 font-medium">
                Local: <strong className="text-slate-700">{getLocalTimeZone()}</strong>
              </span>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Calendar className="w-4 h-4" />
              </div>
              <input
                id="scheduled-at"
                type="datetime-local"
                value={scheduledAtLocal}
                min={toDatetimeLocalValue(new Date())}
                onChange={(e) => setScheduledAtLocal(e.target.value)}
                className={`w-full pl-10 pr-3.5 py-2.5 bg-white border rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-xs ${
                  !isDateInFuture ? 'border-rose-300 ring-1 ring-rose-200' : 'border-slate-200'
                }`}
              />
            </div>

            {!isDateInFuture && (
              <p className="text-xs text-rose-600 font-medium flex items-center gap-1.5 pt-0.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                Scheduled time must be strictly in the future.
              </p>
            )}
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] rounded-xl shadow-md shadow-indigo-600/30 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isEditMode ? 'Saving Changes...' : 'Scheduling...'}</span>
                </>
              ) : (
                <>
                  {isEditMode ? <Check className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
                  <span>{isEditMode ? 'Save Changes' : 'Schedule Post'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
