import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';

interface UseFormDataReturn {
  cities: { value: string; label: string }[];
  districts: { value: string; label: string }[];
  residentialComplexes: { value: string; label: string }[];
  houseTypes: { value: string; label: string }[];
  conditions: { value: string; label: string }[];
  bathrooms: { value: string; label: string }[];
  isLoadingCities: boolean;
  isLoadingDistricts: boolean;
  isLoadingComplexes: boolean;
  loadDistricts: (city: string) => Promise<void>;
  loadResidentialComplexes: (city: string, district: string) => Promise<void>;
}

export const useFormData = (): UseFormDataReturn => {
  const { language } = useLanguage();
  
  const [cities, setCities] = useState<{ value: string; label: string }[]>([]);
  const [districts, setDistricts] = useState<{ value: string; label: string }[]>([]);
  const [residentialComplexes, setResidentialComplexes] = useState<{ value: string; label: string }[]>([]);
  const [houseTypes, setHouseTypes] = useState<{ value: string; label: string }[]>([]);
  const [conditions, setConditions] = useState<{ value: string; label: string }[]>([]);
  const [bathrooms, setBathrooms] = useState<{ value: string; label: string }[]>([]);
  
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);
  const [isLoadingComplexes, setIsLoadingComplexes] = useState(false);
  
  useEffect(() => {
    const loadStaticData = async () => {
      console.log('Loading static data with language:', language); // Для отладки
      
      const [citiesData, houseTypesData, conditionsData, bathroomsData] = await Promise.all([
        api.getCities(language),
        api.getHouseTypes(language),
        api.getConditions(language),
        api.getBathrooms(language),
      ]);
      
      setCities(citiesData);
      setHouseTypes(houseTypesData);
      setConditions(conditionsData);
      setBathrooms(bathroomsData);
    };
    
    loadStaticData();
  }, [language]);

  const loadDistricts = useCallback(async (city: string) => {
    if (!city) {
      setDistricts([]);
      return;
    }
    setIsLoadingDistricts(true);
    const districtsData = await api.getDistricts(city, language);
    setDistricts(districtsData);
    setIsLoadingDistricts(false);
  }, [language]);

  const loadResidentialComplexes = useCallback(async (city: string, district: string) => {
    if (!city || !district) {
      setResidentialComplexes([]);
      return;
    }
    setIsLoadingComplexes(true);
    const complexesData = await api.getResidentialComplexes(city, district, language);
    setResidentialComplexes(complexesData);
    setIsLoadingComplexes(false);
  }, [language]);

  return {
    cities,
    districts,
    residentialComplexes,
    houseTypes,
    conditions,
    bathrooms,
    isLoadingCities: false,
    isLoadingDistricts,
    isLoadingComplexes,
    loadDistricts,
    loadResidentialComplexes,
  };
};