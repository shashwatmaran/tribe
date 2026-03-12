import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Group,
  Member,
  Invoice,
  Charge,
  PaginatedResponse,
  CreateGroupRequest,
  AddMemberRequest,
} from "@/types/api";
import { groupAPI, memberAPI, invoiceAPI, chargeAPI, APIError } from "@/lib/api";

// Query key factories
const queryKeys = {
  all: ["groups"] as const,
  lists: () => [...queryKeys.all, "list"] as const,
  list: (filters?: object) => [...queryKeys.lists(), { filters }] as const,
  details: () => [...queryKeys.all, "detail"] as const,
  detail: (id: string) => [...queryKeys.details(), id] as const,
  members: () => [...queryKeys.all, "members"] as const,
  membersByGroup: (groupId: string) =>
    [...queryKeys.members(), groupId] as const,
  invoices: () => [...queryKeys.all, "invoices"] as const,
  invoicesByGroup: (groupId: string) =>
    [...queryKeys.invoices(), groupId] as const,
  invoice: (groupId: string, invoiceId: string) =>
    [...queryKeys.invoicesByGroup(groupId), invoiceId] as const,
  charges: () => [...queryKeys.all, "charges"] as const,
  chargesByGroup: (groupId: string) =>
    [...queryKeys.charges(), groupId] as const,
};

// ============ GROUP HOOKS ============

export const useGroups = () => {
  return useQuery({
    queryKey: queryKeys.lists(),
    queryFn: () => groupAPI.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGroup = (id: string) => {
  return useQuery({
    queryKey: queryKeys.detail(id),
    queryFn: () => groupAPI.getById(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });
};

export const useCreateGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateGroupRequest) => groupAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
    },
  });
};

export const useGenerateInvoice = (groupId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => groupAPI.generateInvoice(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.invoicesByGroup(groupId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.detail(groupId),
      });
    },
  });
};

// ============ MEMBER HOOKS ============

export const useGroupMembers = (groupId: string) => {
  return useQuery({
    queryKey: queryKeys.membersByGroup(groupId),
    queryFn: () => memberAPI.getByGroupId(groupId),
    staleTime: 3 * 60 * 1000, // 3 minutes
    enabled: !!groupId,
  });
};

export const useAddMember = (groupId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AddMemberRequest) => memberAPI.add(groupId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.membersByGroup(groupId),
      });
    },
  });
};

export const useRemoveMember = (groupId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (memberId: string) => memberAPI.remove(groupId, memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.membersByGroup(groupId),
      });
    },
  });
};

// ============ INVOICE HOOKS ============

export const useInvoices = (
  groupId: string,
  options?: { page?: number; size?: number }
) => {
  return useQuery({
    queryKey: queryKeys.invoicesByGroup(groupId),
    queryFn: () => invoiceAPI.getByGroupId(groupId, options),
    staleTime: 3 * 60 * 1000,
    enabled: !!groupId,
  });
};

export const useInvoice = (groupId: string, invoiceId: string) => {
  return useQuery({
    queryKey: queryKeys.invoice(groupId, invoiceId),
    queryFn: () => invoiceAPI.getById(groupId, invoiceId),
    staleTime: 5 * 60 * 1000,
    enabled: !!groupId && !!invoiceId,
  });
};

// ============ CHARGE HOOKS ============

export const useCharges = (groupId: string) => {
  return useQuery({
    queryKey: queryKeys.chargesByGroup(groupId),
    queryFn: () => chargeAPI.getByGroupId(groupId),
    staleTime: 2 * 60 * 1000, // 2 minutes (more frequent updates for payment status)
    enabled: !!groupId,
  });
};

export const useRetryCharge = (groupId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (chargeId: string) => chargeAPI.retry(chargeId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.chargesByGroup(groupId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.detail(groupId),
      });
    },
  });
};

// ============ HELPER HOOKS ============

/**
 * Hook to get combined group data with members and payment status
 */
export const useGroupWithMembers = (groupId: string) => {
  const group = useGroup(groupId);
  const members = useGroupMembers(groupId);
  const charges = useCharges(groupId);

  return {
    group: group.data,
    members: members.data,
    charges: charges.data,
    isLoading: group.isLoading || members.isLoading || charges.isLoading,
    error: group.error || members.error || charges.error,
    refetch: async () => {
      await Promise.all([
        group.refetch(),
        members.refetch(),
        charges.refetch(),
      ]);
    },
  };
};

/**
 * Hook to get invoices with their associated charges
 */
export const useInvoicesWithCharges = (groupId: string) => {
  const invoices = useInvoices(groupId);
  const charges = useCharges(groupId);

  return {
    invoices: invoices.data,
    charges: charges.data,
    isLoading: invoices.isLoading || charges.isLoading,
    error: invoices.error || charges.error,
  };
};
