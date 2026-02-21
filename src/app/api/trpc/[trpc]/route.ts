import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter } from '../../../../server/api/routing'
import { createTrpcContext } from '../../../../server/api/trpc'

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => createTrpcContext({ headers: req.headers }),
    onError: console.error,
  })

export { handler as GET, handler as POST }
