import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.admin.$post>;
type RequestType = InferRequestType<typeof client.api.admin.$post>["json"];

export const useCreateAdmin = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.admin.$post({ json });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Admin created successfully");
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
    onError: () => {
      toast.error("Failed to create Admin");
    },
  });

  return mutation;
};