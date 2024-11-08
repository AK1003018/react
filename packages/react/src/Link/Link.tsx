import {clsx} from 'clsx'
import React, {forwardRef, useEffect} from 'react'
import {useRefObjectAsForwardedRef} from '../hooks'
import type {SxProp} from '../sx'
import classes from './Link.module.css'
import Box from '../Box'
import type {ComponentProps} from '../utils/types'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'

type StyledLinkProps = {
  /** @deprecated use CSS modules to style hover color */
  hoverColor?: string
  /** Uses a less prominent shade for Link color, and the default link shade on hover. */
  muted?: boolean
  /** @deprecated use `inline` to specify the type of link instead */
  underline?: boolean
  /** Set to true for links adjacent to text, underlining them for clear visibility and improved accessibility. */
  inline?: boolean
} & SxProp

/**
 * @primerid link
 * @primerstatus alpha
 * @primera11yreviewed false
 */
export const Link = forwardRef(({as: Component = 'a', className, inline, underline, ...props}, forwardedRef) => {
  const innerRef = React.useRef<HTMLAnchorElement>(null)
  useRefObjectAsForwardedRef(forwardedRef, innerRef)

  if (__DEV__) {
    /**
     * The Linter yells because it thinks this conditionally calls an effect,
     * but since this is a compile-time flag and not a runtime conditional
     * this is safe, and ensures the entire effect is kept out of prod builds
     * shaving precious bytes from the output, and avoiding mounting a noop effect
     */
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (
        innerRef.current &&
        !(innerRef.current instanceof HTMLButtonElement) &&
        !(innerRef.current instanceof HTMLAnchorElement)
      ) {
        // eslint-disable-next-line no-console
        console.error(
          'Error: Found `Link` component that renders an inaccessible element',
          innerRef.current,
          'Please ensure `Link` always renders as <a> or <button>',
        )
      }
    }, [innerRef])
  }

  if (props.sx) {
    return (
      <Box
        as={Component}
        className={clsx(className, classes.Link)}
        data-muted={props.muted}
        data-inline={inline}
        data-underline={underline}
        {...props}
        // @ts-ignore shh
        ref={innerRef}
      />
    )
  }

  return (
    <Component
      className={clsx(className, classes.Link)}
      data-muted={props.muted}
      data-inline={inline}
      data-underline={underline}
      {...props}
      // @ts-ignore shh
      ref={innerRef}
    />
  )
}) as PolymorphicForwardRefComponent<'a', StyledLinkProps>

Link.displayName = 'Link'

export type LinkProps = ComponentProps<typeof Link>
