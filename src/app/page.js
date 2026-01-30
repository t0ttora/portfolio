import { Suspense } from "react";

import HomePageClient from "./page-client";

export default function HomePage() {
  return (
    <Suspense fallback={null}>
      <HomePageClient />
    </Suspense>
  );
}
