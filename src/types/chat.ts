import type { UIMessage } from 'ai'

export type TExtendedUIMessage = UIMessage & { createdAt?: number }

export type TChatItem =
  | { type: 'message'; data: TExtendedUIMessage; originalIndex: number }
  | { type: 'date-separator'; date: string; timestamp: number }
