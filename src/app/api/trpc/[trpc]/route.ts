import { auth } from '@/lib/auth'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter } from '../../../../server/api/routing'
import { createTrpcContext } from '../../../../server/api/trpc'

const handler = async (req: Request) => {
  const session = await auth.api.getSession({ headers: req.headers })

  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => createTrpcContext({ headers: req.headers, session }),
    onError: console.error,
  })
}

export { handler as GET, handler as POST }
