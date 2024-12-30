"use client";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DeceasedInfoForm from "../components/DeceasedInfoForm";

export default function Home() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <DeceasedInfoForm />
    </QueryClientProvider>
  );
}