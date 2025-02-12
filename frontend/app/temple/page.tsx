"use client";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TempleInfoForm from "../components/TempleInfoForm";

export default function Home() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TempleInfoForm/>
    </QueryClientProvider>
  );
}
