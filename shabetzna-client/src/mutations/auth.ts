import {
  InvalidateQueryFilters,
  QueryClient,
  useMutation,
  UseMutationOptions,
} from "@tanstack/react-query";
import axiosRes from "../shared/axios-req";
import {
  removeFromLocalStorage,
  setLocalStorage,
  USER_TOKEN_KEY,
} from "../shared/local-storage";
import { User } from "../shared/types/entities/user";

export const useLogin = (
  options?: UseMutationOptions<string, Error, Partial<User>, unknown>,
  queryClient?: QueryClient
) =>
  useMutation({
    mutationFn: async (user: Partial<User>) => {
      return (await axiosRes.post("auth/login", user)).data;
    },
    onSuccess: (token) => {
      setLocalStorage(USER_TOKEN_KEY, token);

      return queryClient?.invalidateQueries(["user"] as InvalidateQueryFilters);
    },
    ...options,
  });

export const useLogout = (
  options?: UseMutationOptions<User, Error, void, unknown>,
  queryClient?: QueryClient
) =>
  useMutation<User>({
    mutationFn: async () => {
      return (await axiosRes.post("auth/logout")).data;
    },
    onSuccess: async (data, variables, context) => {
      removeFromLocalStorage(USER_TOKEN_KEY);
      options?.onSuccess && options.onSuccess(data, variables, context);
      return queryClient?.invalidateQueries(["user"] as InvalidateQueryFilters);
    },
    ...options,
  });
