// Payment Pending (customer-amounts-to-be-received)
// MOCK: Payment Pending (customer-amounts-to-be-received)
export const useGetPaymentPending = () =>
  useQuery({
    queryKey: ['payment-pending'],
    queryFn: async () => {
      // Mock response
      return [
        {
          customerId: 1,
          customerName: "John Doe",
          totalAmountToBeReceived: 12000.0,
          pendingEntries: [
            {
              entryId: 101,
              estimate: 7000.0,
              date: "2025-12-01",
              status: "Pending"
            },
            {
              entryId: 102,
              estimate: 5000.0,
              date: "2025-12-05",
              status: "Pending"
            }
          ]
        },
        {
          customerId: 2,
          customerName: "Jane Smith",
          totalAmountToBeReceived: 8000.0,
          pendingEntries: [
            {
              entryId: 103,
              estimate: 8000.0,
              date: "2025-12-03",
              status: "Pending"
            }
          ]
        }
      ];
    },
  });
// Entries Stats (Delivered, Returns per month)
export const useGetEntriesStats = (yearMonth: string) =>
  useQuery({
    queryKey: ['entries-stats', yearMonth],
    queryFn: async () => {
      const res = await apiUtil.get(
        `${BASE_URL}/entries-stats?yearMonth=${yearMonth}&deliveredStatus=Delivered&returnsStatus=Returned`
      );
      // If the response is wrapped in a data property, unwrap it
      if (res && typeof res === 'object' && 'totalEntries' in res) {
        return res;
      }
      if (res && typeof res === 'object' && 'data' in res && typeof res.data === 'object') {
        return res.data;
      }
      return {};
    },
    enabled: !!yearMonth,
  });
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiUtil } from '../lib/api-util';

const BASE_URL = 'http://35.207.219.55:8080/api/mobile';
// const BASE_URL = 'http://localhost:8080/api/mobile';

// Devices
export const useGetDevices = () =>
  useQuery({
    queryKey: ['devices'],
    queryFn: async () => {
      const res = await apiUtil.get(`${BASE_URL}/get-devices`);
      return Array.isArray(res?.data?.devices) ? res.data.devices : [];
    },
  });

export const useAddDevice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (device: any) => apiUtil.post(`${BASE_URL}/add-device`, device),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['devices'] }),
  });
};

export const useUpdateDevice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...device }: { id: string | number; [key: string]: any }) =>
      apiUtil.post(`${BASE_URL}/update-device/${id}`, device),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['devices'] }),
  });
};

export const useDeleteDevice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => apiUtil.delete(`${BASE_URL}/delete-device/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['devices'] }),
  });
};

// Customers
export const useGetCustomers = () =>
  useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const res = await apiUtil.get(`${BASE_URL}/get-customers`);
      return Array.isArray(res?.data?.customers) ? res.data.customers : [];
    },
  });

export const useAddCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (customer: any) => apiUtil.post(`${BASE_URL}/add-customer`, customer),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['customers'] }),
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...customer }: { id: string | number; [key: string]: any }) =>
      apiUtil.post(`${BASE_URL}/update-customer/${id}`, customer),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['customers'] }),
  });
};

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => apiUtil.delete(`${BASE_URL}/delete-customer/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['customers'] }),
  });
};

// Entries
export const useGetEntries = () =>
  useQuery({
    queryKey: ['entries'],
    queryFn: async () => {
      const res = await apiUtil.get(`${BASE_URL}/get-entries`);
      return Array.isArray(res?.data?.entries) ? res.data.entries : [];
    },
  });

export const useAddEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (entry: any) => {
      // Check if entry is FormData
      if (entry instanceof FormData) {
        // For FormData, we need to let the browser set the Content-Type with boundary
        // But we need to delete any existing Content-Type to avoid conflicts
        return apiUtil.post(`${BASE_URL}/add-entry`, entry, {
          headers: {
            'Content-Type': undefined, // Let browser set it
          },
        });
      }
      return apiUtil.post(`${BASE_URL}/add-entry`, entry);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['entries'] }),
  });
};

export const useUpdateEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...entry }: { id: string | number; [key: string]: any }) => {
      // Check if entry is FormData
      const isFormData = entry instanceof FormData;
      // Don't set Content-Type for FormData - axios will set it automatically with boundary
      const config = isFormData ? {} : undefined;
      return apiUtil.post(`${BASE_URL}/update-entry/${id}`, entry, config);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['entries'] }),
  });
};

export const useDeleteEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => apiUtil.delete(`${BASE_URL}/delete-entry/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['entries'] }),
  });
};

// Models
export const useGetModels = (deviceId?: number | string) =>
  useQuery({
    queryKey: ['models', deviceId],
    queryFn: async () => {
      if (!deviceId) return [];
      const res = await apiUtil.get(`${BASE_URL}/get-model?deviceId=${deviceId}`);
      return Array.isArray(res?.data?.models) ? res.data.models : [];
    },
    enabled: !!deviceId,
  });

export const useGetAllModels = () =>
  useQuery({
    queryKey: ['all-models'],
    queryFn: async () => {
      const res = await apiUtil.get(`${BASE_URL}/get-all-models`);
      return Array.isArray(res?.data?.models) ? res.data.models : [];
    },
  });

export const useAddModel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (model: { deviceId: number | string; modelName: string }) =>
      apiUtil.post(`${BASE_URL}/add-model`, model),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-models'] });
      queryClient.invalidateQueries({ queryKey: ['models'] });
    },
  });
};

export const useUpdateModel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...model }: { id: number | string; deviceId?: number | string; modelName?: string; isActive?: boolean }) =>
      apiUtil.post(`${BASE_URL}/update-model`, { ...model, modelId: id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-models'] });
      queryClient.invalidateQueries({ queryKey: ['models'] });
    },
  });
};

export const useDeleteModel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => apiUtil.delete(`${BASE_URL}/delete-model/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-models'] });
      queryClient.invalidateQueries({ queryKey: ['models'] });
    },
  });
};

export const useGetNextEntryId = () =>
  useQuery({
    queryKey: ['next-entry-id'],
    queryFn: async () => {
      const res = await apiUtil.get(`${BASE_URL}/get-next-entry-id`);
      return res; // Returns the number directly
    },
  });

