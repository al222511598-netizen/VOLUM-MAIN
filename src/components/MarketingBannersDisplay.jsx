import React, { useState, useEffect } from 'react';
import { Sparkles, Clock, Flame, Music, Tag, Gift, Percent, Calendar, Radio } from 'lucide-react';
import { getActiveMarketingBanners, getCountdownTimeRemaining } from '../utils/marketingBanners';

/**
 * Selector de iconos SVG vectoriales premium (Regla estricta: Cero Emojis)
 */
export const MarketingBannerIcon = ({ iconType, className = 'w-3.5 h-3.5' }) => {
  switch (iconType) {
    case 'clock':
      return <Clock className={className} />;
    case 'flame':
      return <Flame className={className} />;
    case 'music':
      return <Music className={className} />;
    case 'tag':
      return <Tag className={className} />;
    case 'gift':
      return <Gift className={className} />;
    case 'percent':
      return <Percent className={className} />;
    case 'calendar':
      return <Calendar className={className} />;
    case 'radio':
      return <Radio className={className} />;
    case 'sparkles':
    default:
      return <Sparkles className={className} />;
  }
};

/**
 * Componente de Cuenta Regresiva Reactiva en Vivo (WCAG AA)
 */
const LiveCountdownClock = ({ targetDateTime, completedText = '¡En Vivo Ahora!', isDark = true }) => {
  const [timeRemaining, setTimeRemaining] = useState(() => getCountdownTimeRemaining(targetDateTime));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(getCountdownTimeRemaining(targetDateTime));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDateTime]);

  if (timeRemaining.isLiveNow) {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
        isDark
          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
          : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
      } animate-pulse`}>
        <span className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-emerald-400' : 'bg-emerald-600'}`} />
        {completedText}
      </span>
    );
  }

  if (timeRemaining.isCompleted) {
    return null;
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold tracking-tight bg-slate-950 text-amber-300 border border-amber-500/40 shadow-sm">
      <Clock className="w-3 h-3 text-amber-400 animate-pulse" />
      <span>{timeRemaining.formatted}</span>
    </span>
  );
};

/**
 * Despliega los banners activos de marketing con contraste 100% WCAG AA tanto en modo oscuro como en modo claro.
 */
const MarketingBannersDisplay = ({
  settings,
  primaryColor = '#D97706',
  accentColor = '#F59E0B',
  cardRadiusClass = 'rounded-2xl',
  isCompact = false,
  isDark = true,
  textColor
}) => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  const activeBanners = getActiveMarketingBanners(settings, now);

  if (!activeBanners || activeBanners.length === 0) {
    return null;
  }

  return (
    <div className={`w-full max-w-3xl mx-auto px-4 ${isCompact ? 'pt-2 space-y-1.5' : 'pt-3 space-y-2'}`}>
      {activeBanners.map((banner, index) => {
        const isCountdown = banner.type === 'countdown';
        const isSecondaryBanner = index > 0;

        // Configuración de contraste cromático adaptativo
        let badgeBg, badgeBorder, badgeColor, cardBg, cardBorder, iconBg, iconColor;

        if (isDark) {
          // --- MODO OSCURO ---
          badgeBg = `${accentColor}25`;
          badgeBorder = `${accentColor}50`;
          badgeColor = accentColor;
          cardBg = isSecondaryBanner ? 'rgba(15, 23, 42, 0.7)' : `${primaryColor}1A`;
          cardBorder = isSecondaryBanner ? `${primaryColor}25` : `${primaryColor}40`;
          iconBg = `${primaryColor}28`;
          iconColor = accentColor;

          if (banner.colorTheme === 'emerald') {
            badgeBg = 'rgba(16, 185, 129, 0.2)';
            badgeBorder = 'rgba(16, 185, 129, 0.4)';
            badgeColor = '#34D399';
            cardBg = 'rgba(6, 78, 59, 0.25)';
            cardBorder = 'rgba(16, 185, 129, 0.35)';
            iconBg = 'rgba(16, 185, 129, 0.25)';
            iconColor = '#34D399';
          } else if (banner.colorTheme === 'rose') {
            badgeBg = 'rgba(244, 63, 94, 0.2)';
            badgeBorder = 'rgba(244, 63, 94, 0.4)';
            badgeColor = '#FB7185';
            cardBg = 'rgba(136, 19, 55, 0.25)';
            cardBorder = 'rgba(244, 63, 94, 0.35)';
            iconBg = 'rgba(244, 63, 94, 0.25)';
            iconColor = '#FB7185';
          } else if (banner.colorTheme === 'indigo') {
            badgeBg = 'rgba(99, 102, 241, 0.2)';
            badgeBorder = 'rgba(99, 102, 241, 0.4)';
            badgeColor = '#818CF8';
            cardBg = 'rgba(49, 46, 129, 0.25)';
            cardBorder = 'rgba(99, 102, 241, 0.35)';
            iconBg = 'rgba(99, 102, 241, 0.25)';
            iconColor = '#818CF8';
          }
        } else {
          // --- MODO CLARO (Bistró Botánico, Trattoria Artesanal, Street Food, etc.) ---
          // Fondo sólido con contraste nítido y texto perfectamente legible
          badgeBg = '#FEF3C7';
          badgeBorder = 'rgba(217, 119, 6, 0.4)';
          badgeColor = '#92400E';
          cardBg = '#FFFFFF';
          cardBorder = isSecondaryBanner ? '#E2E8F0' : `${primaryColor}45`;
          iconBg = '#FEF3C7';
          iconColor = '#B45309';

          if (banner.colorTheme === 'emerald') {
            badgeBg = '#DCFCE7';
            badgeBorder = '#86EFAC';
            badgeColor = '#166534';
            cardBg = '#FFFFFF';
            cardBorder = '#86EFAC';
            iconBg = '#DCFCE7';
            iconColor = '#166534';
          } else if (banner.colorTheme === 'rose') {
            badgeBg = '#FFE4E6';
            badgeBorder = '#FDA4AF';
            badgeColor = '#9F1239';
            cardBg = '#FFFFFF';
            cardBorder = '#FDA4AF';
            iconBg = '#FFE4E6';
            iconColor = '#9F1239';
          } else if (banner.colorTheme === 'indigo') {
            badgeBg = '#E0E7FF';
            badgeBorder = '#A5B4FC';
            badgeColor = '#3730A3';
            cardBg = '#FFFFFF';
            cardBorder = '#A5B4FC';
            iconBg = '#E0E7FF';
            iconColor = '#3730A3';
          }
        }

        // Color del título principal: si el fondo es claro, negro carbón (#0F172A); si es oscuro, blanco marfil (#F8FAFC)
        const finalTextColor = textColor || (isDark ? '#F8FAFC' : '#0F172A');

        return (
          <div
            key={banner.id || `banner-${index}`}
            className={`border backdrop-blur-sm transition-all duration-300 shadow-md ${
              isCompact ? 'p-2' : 'p-2.5 sm:p-3'
            } ${cardRadiusClass}`}
            style={{
              backgroundColor: cardBg,
              borderColor: cardBorder
            }}
          >
            <div className="flex items-center justify-between gap-2.5 flex-wrap sm:flex-nowrap">
              {/* Contenido izquierdo: Icono + Insignia + Texto */}
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <div
                  className={`rounded-xl flex items-center justify-center shrink-0 border ${
                    isCompact ? 'w-6 h-6' : 'w-7 h-7'
                  }`}
                  style={{
                    backgroundColor: iconBg,
                    borderColor: badgeBorder,
                    color: iconColor
                  }}
                >
                  <MarketingBannerIcon
                    iconType={banner.icon}
                    className={isCompact ? 'w-3 h-3' : 'w-3.5 h-3.5'}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span
                      className="inline-block px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border shrink-0"
                      style={{
                        backgroundColor: badgeBg,
                        borderColor: badgeBorder,
                        color: badgeColor
                      }}
                    >
                      {banner.badgeText || (isCountdown ? 'Evento' : 'Promo')}
                    </span>

                    <span
                      className={`font-bold tracking-tight ${
                        isCompact ? 'text-[11px] line-clamp-1' : 'text-xs sm:text-sm'
                      }`}
                      style={{ color: finalTextColor }}
                    >
                      {banner.title}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contenido derecho: Cronómetro de cuenta regresiva (si aplica) */}
              {isCountdown && banner.targetDateTime && (
                <div className="shrink-0 pl-9 sm:pl-0">
                  <LiveCountdownClock
                    targetDateTime={banner.targetDateTime}
                    completedText={banner.countdownCompletedText || '¡En Vivo Ahora!'}
                    isDark={isDark}
                  />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MarketingBannersDisplay;
