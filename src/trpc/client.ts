import { createTRPCReact } from '@trpc/react-query'
import type { AppRouter } from '@/server/api/root' // importa il tuo AppRouter

export const trpc = createTRPCReact<AppRouter>()
