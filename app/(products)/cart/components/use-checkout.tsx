import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<
    (typeof client.api.checkout)["orders"]["$post"]
>;
type RequestType = InferRequestType<
    (typeof client.api.checkout)["orders"]["$post"]
>["json"];

export const useCheckout = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            const response = await client.api.checkout["orders"]["$post"]({
                json,
            });
            const data = await response.json();
            return data;
        },
        onSuccess: (data) => {
            toast.success("Payment in progress");
            queryClient.invalidateQueries({ queryKey: ["products"] });
            if (data.url) {
                window.location = data.url;
            }
        },
        onError: () => {
            toast.error("Failed to delete Account");
        },
    });

    return mutation;
};
