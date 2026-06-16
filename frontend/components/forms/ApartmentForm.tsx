'use client';

import { useState, useEffect } from 'react';
import { Select } from '@/components/ui/Select';
import { NumberInput } from '@/components/ui/NumberInput';
import { ApartmentFeatures } from '@/types/apartment';
import { useFormData } from '@/hooks/useFormData';
import { useLanguage } from '@/contexts/LanguageContext';

interface ApartmentFormProps {
  onSubmit: (data: ApartmentFeatures) => void;
  isLoading: boolean;
}

export const ApartmentForm = ({ onSubmit, isLoading }: ApartmentFormProps) => {
  const { t } = useLanguage();
  
  const {
    cities,
    districts,
    residentialComplexes,
    houseTypes,
    conditions,
    bathrooms,
    isLoadingCities,
    isLoadingDistricts,
    isLoadingComplexes,
    loadDistricts,
    loadResidentialComplexes,
  } = useFormData();

  const [formData, setFormData] = useState<ApartmentFeatures>({
    city: '',
    district: '',
    residential_complex: '',
    house_type: '',
    condition: '',
    bathroom: '',
    rooms: null,
    area: null,
    floor: null,
    total_floors: null,
    ceiling_height: null,
    year_built: null,
  });

  useEffect(() => {
    if (formData.city) {
      loadDistricts(formData.city);
    }
  }, [formData.city, loadDistricts]);

  useEffect(() => {
    if (formData.city && formData.district) {
      loadResidentialComplexes(formData.city, formData.district);
    }
  }, [formData.city, formData.district, loadResidentialComplexes]);

  const handleSelectChange = (field: keyof ApartmentFeatures, value: string) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };
      
      if (field === 'city') {
        newData.district = '';
        newData.residential_complex = '';
      }
      
      if (field === 'district') {
        newData.residential_complex = '';
      }
      
      return newData;
    });
  };

  const handleNumberChange = (field: keyof ApartmentFeatures, value: number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const requiredFields: (keyof ApartmentFeatures)[] = [
      'city', 'district', 'residential_complex', 'house_type', 'condition', 'bathroom'
    ];
    
    const numberFields: (keyof ApartmentFeatures)[] = [
      'rooms', 'area', 'floor', 'total_floors', 'ceiling_height', 'year_built'
    ];
    
    const isAllSelectsFilled = requiredFields.every(field => formData[field] !== '');
    const isAllNumbersValid = numberFields.every(field => {
      const value = formData[field] as number | null;
      return value !== null && value > 0;
    });
    
    if (!isAllSelectsFilled || !isAllNumbersValid) {
      alert(t('form.validation.required'));
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="form-left-column">
          <Select
            label={t('form.fields.city')}
            options={cities}
            value={formData.city}
            onChange={(e) => handleSelectChange('city', e.target.value)}
            required
            disabled={isLoadingCities}
            placeholder={t('form.placeholders.select')}
          />
          
          <Select
            label={t('form.fields.district')}
            options={districts}
            value={formData.district}
            onChange={(e) => handleSelectChange('district', e.target.value)}
            required
            disabled={!formData.city || isLoadingDistricts}
            placeholder={t('form.placeholders.select')}
          />
          
          <Select
            label={t('form.fields.residential_complex')}
            options={residentialComplexes}
            value={formData.residential_complex}
            onChange={(e) => handleSelectChange('residential_complex', e.target.value)}
            required
            disabled={!formData.district || isLoadingComplexes}
            placeholder={t('form.placeholders.select')}
          />
          
          <Select
            label={t('form.fields.house_type')}
            options={houseTypes}
            value={formData.house_type}
            onChange={(e) => handleSelectChange('house_type', e.target.value)}
            required
            placeholder={t('form.placeholders.select')}
          />
          
          <Select
            label={t('form.fields.condition')}
            options={conditions}
            value={formData.condition}
            onChange={(e) => handleSelectChange('condition', e.target.value)}
            required
            placeholder={t('form.placeholders.select')}
          />
          
          <Select
            label={t('form.fields.bathroom')}
            options={bathrooms}
            value={formData.bathroom}
            onChange={(e) => handleSelectChange('bathroom', e.target.value)}
            required
            placeholder={t('form.placeholders.select')}
          />
        </div>
        
        <div className="form-right-column">
          <NumberInput
            label={t('form.fields.rooms')}
            value={formData.rooms}
            onChange={(value) => handleNumberChange('rooms', value)}
            min={1}
            max={20}
            step={1}
            placeholder={t('form.placeholders.rooms')}
            required
          />
          
          <NumberInput
            label={t('form.fields.area')}
            value={formData.area}
            onChange={(value) => handleNumberChange('area', value)}
            min={0.1}
            max={1000}
            step={0.1}
            stepPrecision={1}
            placeholder={t('form.placeholders.area')}
            required
          />
          
          <NumberInput
            label={t('form.fields.total_floors')}
            value={formData.total_floors}
            onChange={(value) => handleNumberChange('total_floors', value)}
            min={1}
            max={50}
            step={1}
            placeholder={t('form.placeholders.total_floors')}
            required
          />
          
          <NumberInput
            label={t('form.fields.floor')}
            value={formData.floor}
            onChange={(value) => handleNumberChange('floor', value)}
            min={1}
            max={formData.total_floors || 100}
            step={1}
            placeholder={t('form.placeholders.floor')}
            required
          />

          <NumberInput
            label={t('form.fields.ceiling_height')}
            value={formData.ceiling_height}
            onChange={(value) => handleNumberChange('ceiling_height', value)}
            min={1}
            max={5}
            step={0.1}
            stepPrecision={1}
            placeholder={t('form.placeholders.ceiling_height')}
            required
          />
          
          <NumberInput
            label={t('form.fields.year_built')}
            value={formData.year_built}
            onChange={(value) => handleNumberChange('year_built', value)}
            min={1500}
            max={2026}
            step={1}
            placeholder={t('form.placeholders.year_built')}
            required
          />
        </div>
      </div>
      
      <button type="submit" className="submit-btn" disabled={isLoading}>
        {isLoading ? <span className="loader"></span> : t('form.submit')}
      </button>
    </form>
  );
};