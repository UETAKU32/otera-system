"use client";
import MemberInfoForm from "../components/MemberInfoForm";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function Home() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <MemberInfoForm />
    </QueryClientProvider>
  );
}
