import { createTRPCReact } from '@trpc/react-query'
import { appRouter } from '../../server/api/routing'

export const trpc = createTRPCReact<typeof appRouter>()
