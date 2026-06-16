'use client';

import { PredictionResponse } from '@/types/apartment';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  TrendingUp,
  Shield,
} from 'lucide-react';

interface PriceDisplayProps {
  result: PredictionResponse | null;
}

export const PriceDisplay = ({ result }: PriceDisplayProps) => {
  const { t } = useLanguage();

  if (!result) {
    return (
      <div className="result-placeholder">
        <div>
          <p style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>{t('result.placeholder.title')}</p>
          <p style={{ fontSize: '0.875rem' }}>{t('result.placeholder.description')}</p>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-KZ').format(Math.round(price));
  };

  const formatMillions = (price: number) => {
    return (price / 1000000).toFixed(1);
  };

  return (
    <div className="result-content">
      <div className="price-main">
        <div className="price-label">{t('result.estimatedPrice')}</div>
        <div className="price-value">{formatPrice(result.price)} ₸</div>
      </div>
      
      <div className="price-per-meter">
        <div className="label">{t('result.pricePerMeter')}</div>
        <div className="value">{formatPrice(result.price_per_m2)} ₸ / м²</div>
      </div>
      
      <div className="range-card">
        <div className="range-header">
          <TrendingUp size={32} />
          <div className="range-title">{t('result.rangeTitle')}</div>
        </div>
        <div className="range-values">
          <span className="range-min">{formatMillions(result.min_price)} {t('result.million')} ₸</span>
          <span className="range-dash">—</span>
          <span className="range-max">{formatMillions(result.max_price)} {t('result.million')} ₸</span>
        </div>
        <div className="range-bar">
          <div className="range-fill" />
        </div>
        <div className="range-percent">
          <span className="negative">-{result.mape}%</span>
          <span>{t('result.modelEstimate')}</span>
          <span className="positive">+{result.mape}%</span>
        </div>
        <div className="range-note">
          {t('result.rangeNote')} {result.mape}%
        </div>
      </div>
      
      <div className="info-card">
        <div className="info-header">
          <div className="icon-box">
            <Shield size={20} />
          </div>
          <div className="info-title">{t('result.important')}</div>
        </div>
        <div className="info-text">
          {t('result.importantText')}
        </div>
      </div>
    </div>
  );
};