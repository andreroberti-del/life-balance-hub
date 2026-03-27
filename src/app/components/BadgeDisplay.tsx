import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Badge } from '../utils/gamification';

interface BadgeCardProps {
  badge: Badge;
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
}

export function BadgeCard({ badge, size = 'medium', onClick }: BadgeCardProps) {
  const { language } = useLanguage();

  const sizeConfig = {
    small: {
      container: 'w-16 h-16',
      icon: 'text-2xl',
      badge: 'w-16 h-16',
    },
    medium: {
      container: 'w-20 h-20',
      icon: 'text-3xl',
      badge: 'w-20 h-20',
    },
    large: {
      container: 'w-32 h-32',
      icon: 'text-5xl',
      badge: 'w-32 h-32',
    },
  };

  const config = sizeConfig[size];
  const name = badge[`name_${language}` as keyof Badge] as string;

  return (
    <button
      onClick={onClick}
      className={`${config.container} relative rounded-2xl flex items-center justify-center transition-all duration-300 ${
        badge.isLocked
          ? 'bg-[#2A2A2A] grayscale opacity-40 hover:opacity-60'
          : 'bg-gradient-to-br from-[#D4FF00]/20 to-[#A0E000]/20 border-2 border-[#D4FF00] hover:scale-105 hover:shadow-[0_0_20px_rgba(212,255,0,0.3)]'
      }`}
    >
      {/* Lock overlay for locked badges */}
      {badge.isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl">
          <div className="text-2xl">{'\u{1F512}'}</div>
        </div>
      )}

      {/* Badge icon */}
      <div className={`${config.icon} ${badge.isLocked ? '' : 'animate-bounce-subtle'}`}>
        {badge.icon}
      </div>

      {/* Glow effect for earned badges */}
      {!badge.isLocked && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#D4FF00]/20 to-transparent blur-xl -z-10" />
      )}
    </button>
  );
}

interface BadgeGridProps {
  badges: Badge[];
  onBadgeClick?: (badge: Badge) => void;
}

export function BadgeGrid({ badges, onBadgeClick }: BadgeGridProps) {
  const { t, language } = useLanguage();

  const earnedCount = badges.filter(b => !b.isLocked).length;
  const totalCount = badges.length;

  // Safe access to translation keys with fallbacks
  const tGamification = (t as any)?.gamification || {};

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-white">{tGamification.badges || 'Badges'}</h3>
          <p className="text-sm text-gray-400">
            {earnedCount} / {totalCount} {tGamification.earned || 'earned'}
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-[#D4FF00]">{totalCount > 0 ? Math.round((earnedCount / totalCount) * 100) : 0}%</div>
          <div className="text-xs text-gray-400">{tGamification.complete || 'complete'}</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#D4FF00] to-[#A0E000] transition-all duration-500"
          style={{ width: `${totalCount > 0 ? (earnedCount / totalCount) * 100 : 0}%` }}
        />
      </div>

      {/* Badge Grid */}
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {badges.map((badge) => (
          <div key={badge.id} className="flex flex-col items-center gap-2">
            <BadgeCard
              badge={badge}
              size="medium"
              onClick={() => onBadgeClick?.(badge)}
            />
            <div className="text-center">
              <div className={`text-xs font-medium ${badge.isLocked ? 'text-gray-500' : 'text-gray-300'}`}>
                {badge[`name_${language}` as keyof Badge] as string}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface BadgeModalProps {
  badge: Badge;
  onClose: () => void;
  isNewlyEarned?: boolean;
}

export function BadgeModal({ badge, onClose, isNewlyEarned = false }: BadgeModalProps) {
  const { language, t } = useLanguage();

  const name = badge[`name_${language}` as keyof Badge] as string;
  const description = badge[`description_${language}` as keyof Badge] as string;

  // Safe access to translation keys with fallbacks
  const tGamification = (t as any)?.gamification || {};
  const tCommon = (t as any)?.common || {};

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-[#1A1A1A] rounded-3xl p-8 max-w-md w-full relative overflow-hidden">
        {/* Animated background for newly earned badges */}
        {isNewlyEarned && (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-[#D4FF00]/20 to-transparent animate-pulse" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-[#D4FF00]/30 rounded-full blur-3xl animate-pulse" />
          </>
        )}

        {/* Content */}
        <div className="relative z-10">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-0 right-0 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white"
          >
            {'\u2715'}
          </button>

          {/* Badge Display */}
          <div className="flex flex-col items-center mb-6">
            {isNewlyEarned && (
              <div className="text-[#D4FF00] text-sm font-bold mb-4 animate-bounce">
                {'\u{1F389}'} {tGamification.badgeEarned || 'Badge Earned!'} {'\u{1F389}'}
              </div>
            )}

            <BadgeCard badge={badge} size="large" />

            <h3 className="text-2xl font-bold text-white mt-4">{name}</h3>
            <p className="text-sm text-gray-400 mt-2 text-center">{description}</p>
          </div>

          {/* Details */}
          <div className="space-y-3 bg-[#242424] rounded-2xl p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">{tGamification.category || 'Category'}</span>
              <span className="text-white capitalize">{badge.category}</span>
            </div>
            {badge.earnedAt && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">{tGamification.earnedOn || 'Earned On'}</span>
                <span className="text-white">{new Date(badge.earnedAt).toLocaleDateString()}</span>
              </div>
            )}
            {badge.isLocked && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">{tGamification.requirement || 'Requirement'}</span>
                <span className="text-[#D4FF00]">{badge.requirement}</span>
              </div>
            )}
          </div>

          {/* Action */}
          <button
            onClick={onClose}
            className="w-full mt-6 py-3 bg-[#D4FF00] text-[#1A1A1A] font-bold rounded-full hover:bg-[#E5FF33] transition-colors"
          >
            {isNewlyEarned ? (tGamification.awesome || 'Awesome!') : (tCommon.close || 'Close')}
          </button>
        </div>

        {/* Confetti animation for newly earned */}
        {isNewlyEarned && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-[#D4FF00] rounded-full animate-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 0.5}s`,
                  animationDuration: `${1 + Math.random()}s`,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
