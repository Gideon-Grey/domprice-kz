import { ApartmentFeatures, PredictionResponse } from '@/types/apartment';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://domprice-kz-production.up.railway.app';

export type Option = {
  value: string;
  label: string;
};

function extractOptions(data: unknown, key: string): Option[] {
  if (!data || typeof data !== 'object') return [];
  
  const response = data as Record<string, unknown>;
  
  if (!response[key] || !Array.isArray(response[key])) return [];
  
  const items = response[key] as unknown[];
  
  if (items.length === 0) return [];

  if (typeof items[0] === 'object' && items[0] !== null && 'value' in items[0] && 'label' in items[0]) {
    return items as Option[];
  }
  
  if (typeof items[0] === 'string') {
    return (items as string[]).map((item: string) => ({
      value: item,
      label: item,
    }));
  }
  
  return [];
}

export const api = {
  async getCities(lang: string = 'ru'): Promise<Option[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/options/cities?lang=${encodeURIComponent(lang)}`
      );
      
      if (!response.ok) {
        console.error(`API Error: ${response.status}`);
        return [];
      }
      
      const data: unknown = await response.json();
      return extractOptions(data, 'cities');
    } catch (error) {
      console.error('Error fetching cities:', error);
      return [];
    }
  },

  async getDistricts(city: string, lang: string = 'ru'): Promise<Option[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/options/districts?city=${encodeURIComponent(
          city
        )}&lang=${encodeURIComponent(lang)}`
      );
      
      if (!response.ok) {
        console.error(`API Error: ${response.status}`);
        return [];
      }
      
      const data: unknown = await response.json();
      return extractOptions(data, 'districts');
    } catch (error) {
      console.error('Error fetching districts:', error);
      return [];
    }
  },

  async getResidentialComplexes(
    city: string,
    district: string,
    lang: string = 'ru'
  ): Promise<Option[]> {
    try {
      let url = `${API_BASE_URL}/options/residential-complexes?city=${encodeURIComponent(
        city
      )}&lang=${encodeURIComponent(lang)}`;

      if (district) {
        url += `&district=${encodeURIComponent(district)}`;
      }

      const response = await fetch(url);
      
      if (!response.ok) {
        console.error(`API Error: ${response.status}`);
        return [];
      }
      
      const data: unknown = await response.json();
      return extractOptions(data, 'residential_complexes');
    } catch (error) {
      console.error('Error fetching residential complexes:', error);
      return [];
    }
  },

  async getHouseTypes(lang: string = 'ru'): Promise<Option[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/options/house-types?lang=${encodeURIComponent(lang)}`
      );
      
      if (!response.ok) {
        console.error(`API Error: ${response.status}`);
        return [];
      }
      
      const data: unknown = await response.json();
      return extractOptions(data, 'house_types');
    } catch (error) {
      console.error('Error fetching house types:', error);
      return [];
    }
  },

  async getConditions(lang: string = 'ru'): Promise<Option[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/options/conditions?lang=${encodeURIComponent(lang)}`
      );
      
      if (!response.ok) {
        console.error(`API Error: ${response.status}`);
        return [];
      }
      
      const data: unknown = await response.json();
      return extractOptions(data, 'conditions');
    } catch (error) {
      console.error('Error fetching conditions:', error);
      return [];
    }
  },

  async getBathrooms(lang: string = 'ru'): Promise<Option[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/options/bathrooms?lang=${encodeURIComponent(lang)}`
      );
      
      if (!response.ok) {
        console.error(`API Error: ${response.status}`);
        return [];
      }
      
      const data: unknown = await response.json();
      return extractOptions(data, 'bathrooms');
    } catch (error) {
      console.error('Error fetching bathrooms:', error);
      return [];
    }
  },

  async predict(data: ApartmentFeatures): Promise<PredictionResponse> {
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Ошибка при получении прогноза');
    }

    const result = await response.json();

    return {
      price: result.price,
      price_per_m2: result.price_per_m2,
      min_price: result.min_price,
      max_price: result.max_price,
      mape: result.mape || 11.2,
    };
  },
};