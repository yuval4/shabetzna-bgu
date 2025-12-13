import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../app";
import axiosRes from "../shared/axios-req";
import { User } from "../shared/types/entities/user";

export const useCreateUser = () =>
  useMutation({
    mutationFn: async (user: Partial<User>) => {
      return await axiosRes.post("users", user);
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: ["users", "user", "auth"],
      });
    },
  });
