import { usersApi } from '@/lib/axios';

export interface Facility {
  id: string;
  name: string;
  type: string;
  location: string;
  description: string;
}

export interface FacilityResponse {
  status: boolean;
  message: string;
  data: Facility[];
}

export const facilityService = {
  getAllFacilities: async () => {
    try {
      const response = await usersApi.post<FacilityResponse>('/getAllFacilities');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch facilities');
    }
  },

  addFacility: async (facility: Omit<Facility, 'id'>) => {
    try {
      const response = await usersApi.post('/addFacility', facility);
      return response.data;
    } catch (error) {
      throw new Error('Failed to add facility');
    }
  },

  deleteFacility: async (id: string) => {
    try {
      const response = await usersApi.post('/removeFacility', { id });
      return response.data;
    } catch (error) {
      throw new Error('Failed to delete facility');
    }
  },
};