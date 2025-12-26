'use client'

import { ConvexClientProvider } from '@/providers/ConvexProvider'

export function Providers({ children }: { children: React.ReactNode }) {
  return <ConvexClientProvider>{children}</ConvexClientProvider>
}
