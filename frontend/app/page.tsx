"use client";
import CustomerManagement from "./components/CustomerManagement";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";
import { useState } from "react";

export default function Home() {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryStreamedHydration>
        <CustomerManagement />
      </ReactQueryStreamedHydration>
    </QueryClientProvider>
  );
}
