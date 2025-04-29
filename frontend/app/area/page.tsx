"use client";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AreaInfoForm from "../components/AreaInfoForm";


export default function Home() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AreaInfoForm/>
    </QueryClientProvider>
  );
}
