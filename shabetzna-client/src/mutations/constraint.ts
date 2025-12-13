import { InvalidateQueryFilters, useMutation } from "@tanstack/react-query";
import axiosRes from "../shared/axios-req";
import { Constraint } from "../shared/types/entities/constraint";
import { User } from "../shared/types/entities/user";
import { queryClient } from "../app";

type PartialReasonConstraint = Pick<
  Constraint,
  "type" | "date" | "reason" | "shiftType"
> &
  Partial<Pick<Constraint, "id">>;

interface CreateConstraintMutation extends PartialReasonConstraint {
  userId: User["id"];
}

export const useCreateConstraint = () =>
  useMutation({
    mutationFn: async (constraint: CreateConstraintMutation) => {
      return await axiosRes.put("constraints", constraint);
    },
    onSuccess: () => {
      return queryClient.invalidateQueries([
        "constraint",
        "constraints",
      ] as InvalidateQueryFilters);
    },
  });

export const useDeleteConstraint = () =>
  useMutation({
    mutationFn: async (constraintId: Constraint["id"]) => {
      return await axiosRes.delete(`constraints/${constraintId}`);
    },
    onSuccess: () => {
      return queryClient.invalidateQueries([
        "constraint",
        "constraints",
      ] as InvalidateQueryFilters);
    },
  });

export const useRejectConstraint = () =>
  useMutation({
    mutationFn: async (constraintId: Constraint["id"]) => {
      return await axiosRes.put(`constraints/${constraintId}/reject`);
    },
    onSuccess: () => {
      return queryClient.invalidateQueries([
        "constraint",
        "constraints",
      ] as InvalidateQueryFilters);
    },
  });

export const useApproveConstraint = () =>
  useMutation({
    mutationFn: async (constraintId: Constraint["id"]) => {
      return await axiosRes.put(`constraints/${constraintId}/approve`);
    },
    onSuccess: () => {
      return queryClient.invalidateQueries([
        "constraint",
        "constraints",
      ] as InvalidateQueryFilters);
    },
  });
