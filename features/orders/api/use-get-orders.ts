import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export const useGetOrders = () => {
  const query = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const response = await client.api.orders.$get();
      if (!response.ok) {
        throw new Error("failed to fetch orders");
      }

      const { data } = await response.json();
      return data;
    },
  });
  return query;
};
