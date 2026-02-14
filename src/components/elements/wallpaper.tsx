import { clsx } from 'clsx/lite'
import type { ComponentProps } from 'react'

export function Wallpaper({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={clsx(
        '[--padding-min(10%,--spacing(16))] relative group-data-[placement=bottom]:px-(--padding) group-data-[placement=bottom]:pt-(--padding) group-data-[placement=bottom-left]:pt-(--padding) group-data-[placement=bottom-left]:pr-(--padding) group-data-[placement=bottom-right]:pt-(--padding) group-data-[placement=bottom-right]:pl-(--padding) group-data-[placement=top]:px-(--padding) group-data-[placement=top]:pb-(--padding) group-data-[placement=top-left]:pr-(--padding) group-data-[placement=top-left]:pb-(--padding) group-data-[placement=top-right]:pr-(--padding) group-data-[placement=top-right]:pb-(--padding) group-data-[placement=top-right]:pl-(--padding)',
        className,
      )}
      {...props}
    />
  )
}
