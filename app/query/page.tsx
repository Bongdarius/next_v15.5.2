"use client";

import QueryPage from "@/components/query/QueryPage";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading query...</div>}>
      <QueryPage />
    </Suspense>
  );
}
