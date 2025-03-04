import {clsx} from 'clsx'
import React, {forwardRef, useEffect} from 'react'
import styled from 'styled-components'
import {AlertIcon, InfoIcon, StopIcon, CheckCircleIcon, XIcon} from '@primer/octicons-react'
import {Button, IconButton, type ButtonProps} from '../Button'
import {get} from '../constants'
import {VisuallyHidden} from '../VisuallyHidden'
import {useMergedRefs} from '../internal/hooks/useMergedRefs'
import {useFeatureFlag} from '../FeatureFlags'
import classes from './Banner.module.css'
import {toggleStyledComponent} from '../internal/utils/toggleStyledComponent'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'

type BannerVariant = 'critical' | 'info' | 'success' | 'upsell' | 'warning'

export type BannerProps = React.ComponentPropsWithoutRef<'section'> & {
  /**
   * Provide an optional label to override the default name for the Banner
   * landmark region
   */
  'aria-label'?: string

  /**
   * Provide an optional className to add to the outermost element rendered by
   * the Banner
   */
  className?: string

  /**
   * Provide an optional description for the Banner. This should provide
   * supplemental information about the Banner
   */
  description?: React.ReactNode

  /**
   * Specify whether the title of the Banner should be visible or not.
   */
  hideTitle?: boolean

  /**
   * Provide a custom icon for the Banner. This is only available when `variant` is `info` or `upsell`
   */
  icon?: React.ReactNode

  /**
   * Optionally provide a handler to be called when the banner is dismissed.
   * Providing this prop will show a dismiss button.
   *
   * Note: This is not available for critical banners.
   */
  onDismiss?: () => void

  /**
   * Provide an optional primary action for the Banner.
   */
  primaryAction?: React.ReactNode

  /**
   * Provide an optional secondary action for the Banner
   */
  secondaryAction?: React.ReactNode

  /**
   * The title for the Banner. This will be used as the accessible name and is
   * required unless `Banner.Title` is used as a child.
   */
  title?: React.ReactNode

  /**
   * Specify the type of the Banner
   */
  variant?: BannerVariant
}

const iconForVariant: Record<BannerVariant, React.ReactNode> = {
  critical: <StopIcon />,
  info: <InfoIcon />,
  success: <CheckCircleIcon />,
  upsell: <InfoIcon />,
  warning: <AlertIcon />,
}

const labels: Record<BannerVariant, string> = {
  critical: 'Critical',
  info: 'Information',
  success: 'Success',
  upsell: 'Recommendation',
  warning: 'Warning',
}

const CSS_MODULES_FEATURE_FLAG = 'primer_react_css_modules_ga'

export const Banner = React.forwardRef<HTMLElement, BannerProps>(function Banner(
  {
    'aria-label': label,
    children,
    className,
    description,
    hideTitle,
    icon,
    onDismiss,
    primaryAction,
    secondaryAction,
    title,
    variant = 'info',
    ...rest
  },
  forwardRef,
) {
  const dismissible = variant !== 'critical' && onDismiss
  const hasActions = primaryAction || secondaryAction
  const bannerRef = React.useRef<HTMLElement>(null)
  const ref = useMergedRefs(forwardRef, bannerRef)
  const enabled = useFeatureFlag(CSS_MODULES_FEATURE_FLAG)
  const supportsCustomIcon = variant === 'info' || variant === 'upsell'

  if (__DEV__) {
    // This hook is called consistently depending on the environment
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (title) {
        return
      }

      const {current: banner} = bannerRef
      if (!banner) {
        return
      }

      const hasTitle = banner.querySelector('[data-banner-title]')
      if (!hasTitle) {
        throw new Error(
          'Expected a title to be provided to the <Banner> component with the `title` prop or through `<Banner.Title>` but no title was found',
        )
      }
    }, [title])
  }

  return (
    <StyledBanner
      {...rest}
      aria-label={label ?? labels[variant]}
      as="section"
      className={clsx(className, {
        [classes.Banner]: enabled,
      })}
      data-dismissible={onDismiss ? '' : undefined}
      data-title-hidden={hideTitle ? '' : undefined}
      data-variant={variant}
      tabIndex={-1}
      ref={ref}
    >
      {!enabled ? <style>{BannerContainerQuery}</style> : null}
      <div
        className={clsx({
          BannerIcon: !enabled,
          [classes.BannerIcon]: enabled,
        })}
      >
        {icon && supportsCustomIcon ? icon : iconForVariant[variant]}
      </div>
      <div
        className={clsx({
          BannerContainer: !enabled,
          [classes.BannerContainer]: enabled,
        })}
      >
        <div
          className={clsx({
            BannerContent: !enabled,
            [classes.BannerContent]: enabled,
          })}
        >
          {title ? (
            hideTitle ? (
              <VisuallyHidden>
                <BannerTitle>{title}</BannerTitle>
              </VisuallyHidden>
            ) : (
              <BannerTitle>{title}</BannerTitle>
            )
          ) : null}
          {description ? <BannerDescription>{description}</BannerDescription> : null}
          {children}
        </div>
        {hasActions ? <BannerActions primaryAction={primaryAction} secondaryAction={secondaryAction} /> : null}
      </div>
      {dismissible ? (
        <IconButton
          aria-label="Dismiss banner"
          onClick={onDismiss}
          className={clsx({
            BannerDismiss: !enabled,
            [classes.BannerDismiss]: enabled,
          })}
          icon={XIcon}
          variant="invisible"
        />
      ) : null}
    </StyledBanner>
  )
})

const StyledBanner = toggleStyledComponent(
  CSS_MODULES_FEATURE_FLAG,
  /**
   * For styling, it's important that the icons and the text have the same height
   * for alignment to occur in multi-line scenarios. Currently, we use a
   * line-height of `20px` so that means that the height of icons should match
   * that value.
   */
  'div',
  styled.div`
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: start;
    background-color: var(--banner-bgColor);
    border: var(--borderWidth-thin, 1px) solid var(--banner-borderColor);
    padding: var(--base-size-8, 0.5rem);
    border-radius: var(--borderRadius-medium, ${get('radii.2')});

    @supports (container-type: inline-size) {
      container: banner / inline-size;
    }

    &[data-variant='critical'] {
      --banner-bgColor: ${get('colors.danger.subtle')};
      --banner-borderColor: ${get('colors.danger.muted')};
      --banner-icon-fgColor: ${get('colors.danger.fg')};
    }

    &[data-variant='info'] {
      --banner-bgColor: ${get('colors.accent.subtle')};
      --banner-borderColor: ${get('colors.accent.muted')};
      --banner-icon-fgColor: ${get('colors.accent.fg')};
    }

    &[data-variant='success'] {
      --banner-bgColor: ${get('colors.success.subtle')};
      --banner-borderColor: ${get('colors.success.muted')};
      --banner-icon-fgColor: ${get('colors.success.fg')};
    }

    &[data-variant='upsell'] {
      --banner-bgColor: var(--bgColor-upsell-muted, ${get('colors.done.subtle')});
      --banner-borderColor: var(--borderColor-upsell-muted, ${get('colors.done.muted')});
      --banner-icon-fgColor: var(--fgColor-upsell-muted, ${get('colors.done.fg')});
    }

    &[data-variant='warning'] {
      --banner-bgColor: ${get('colors.attention.subtle')};
      --banner-borderColor: ${get('colors.attention.muted')};
      --banner-icon-fgColor: ${get('colors.attention.fg')};
    }

    /* BannerIcon ------------------------------------------------------------- */

    .BannerIcon {
      display: grid;
      place-items: center;
      padding: var(--base-size-8, 0.5rem);
    }

    .BannerIcon svg {
      color: var(--banner-icon-fgColor);
      fill: var(--banner-icon-fgColor);
      /* 20px is the line box height of the trailing action buttons */
      height: var(--base-size-20, 1.25rem);
    }

    &[data-title-hidden=''] .BannerIcon svg {
      height: var(--base-size-16, 1rem);
    }

    /* BannerContainer -------------------------------------------------------- */

    .BannerContainer {
      font-size: var(--text-body-size-medium, 0.875rem);
      align-items: start;
      line-height: var(--text-body-lineHeight-medium, calc(20 / 14));
      row-gap: var(--base-size-4, 0.25rem);
      column-gap: var(--base-size-4, 0.25rem);
    }

    & :where(.BannerContainer) {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
    }

    &[data-dismissible]:not([data-title-hidden='']) .BannerContainer {
      display: grid;
      grid-template-columns: auto;
      grid-template-rows: auto;
    }

    /* BannerContent ---------------------------------------------------------- */

    .BannerContent {
      display: grid;
      row-gap: var(--base-size-4, 0.25rem);
      grid-column-start: 1;
      margin-block: var(--base-size-8, 0.5rem);
    }

    &[data-title-hidden=''] .BannerContent {
      margin-block: var(--base-size-6, 0.375rem);
    }

    @media screen and (min-width: 544px) {
      .BannerContent {
        flex: 1 1 0%;
      }
    }

    .BannerTitle {
      margin: 0;
      font-size: inherit;
      font-weight: var(--base-text-weight-semibold, 600);
    }

    /* BannerActions ---------------------------------------------------------- */
    .BannerActionsContainer {
      display: flex;
      column-gap: var(--base-size-12, 0.5rem);
      align-items: center;
    }

    .BannerActions :where([data-primary-action='trailing']) {
      display: none;
    }

    @media screen and (min-width: 544px) {
      .BannerActions :where([data-primary-action='trailing']) {
        display: flex;
      }

      .BannerActions :where([data-primary-action='leading']) {
        display: none;
      }
    }

    &[data-dismissible]:not([data-title-hidden]) .BannerActions {
      margin-block-end: var(--base-size-6, 0.375rem);
    }

    &[data-dismissible]:not([data-title-hidden]) .BannerActionsContainer[data-primary-action='trailing'] {
      display: none;
    }

    &[data-dismissible]:not([data-title-hidden]) .BannerActionsContainer[data-primary-action='leading'] {
      display: flex;
    }

    /* BannerDismiss ---------------------------------------------------------- */

    .BannerDismiss {
      display: grid;
      place-items: center;
      padding: var(--base-size-8, 0.5rem);
      margin-inline-start: var(--base-size-4, 0.25rem);
    }

    .BannerDismiss svg {
      color: var(--banner-icon-fgColor);
    }
  `,
)

const BannerContainerQuery = `
  @container banner (max-width: 500px) {
    .BannerContainer {
      display: grid;
      grid-template-rows: auto auto;
    }

    .BannerActions {
      margin-block-end: var(--size-small, 0.375rem);
    }

    .BannerActions [data-primary-action="trailing"] {
      display: none;
    }

    .BannerActions [data-primary-action="leading"] {
      display: flex;
    }
  }

  @container banner (min-width: 500px) {
    .BannerContainer {
      display: grid;
      grid-template-columns: auto auto;
    }

    .BannerActions [data-primary-action="trailing"] {
      display: flex;
      min-height: var(--base-size-32, 2rem);
    }

    .BannerActions [data-primary-action="leading"] {
      display: none;
    }
  }
`

type HeadingElement = 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

export type BannerTitleProps<As extends HeadingElement> = {
  as?: As
  className?: string
} & React.ComponentPropsWithoutRef<As extends 'h2' ? 'h2' : As>

export function BannerTitle<As extends HeadingElement>(props: BannerTitleProps<As>) {
  const {as: Heading = 'h2', className, children, ...rest} = props
  const enabled = useFeatureFlag(CSS_MODULES_FEATURE_FLAG)
  return (
    <Heading
      {...rest}
      className={clsx(className, {
        [classes.BannerTitle]: enabled,
        BannerTitle: !enabled,
      })}
      data-banner-title=""
    >
      {children}
    </Heading>
  )
}

export type BannerDescriptionProps = React.ComponentPropsWithoutRef<'div'>

export function BannerDescription({children, className, ...rest}: BannerDescriptionProps) {
  return (
    <div {...rest} className={clsx('BannerDescription', className)}>
      {children}
    </div>
  )
}

export type BannerActionsProps = {
  primaryAction?: React.ReactNode
  secondaryAction?: React.ReactNode
}

export function BannerActions({primaryAction, secondaryAction}: BannerActionsProps) {
  const enabled = useFeatureFlag(CSS_MODULES_FEATURE_FLAG)
  return (
    <div
      className={clsx({
        [classes.BannerActions]: enabled,
        BannerActions: !enabled,
      })}
    >
      <div
        className={clsx({
          [classes.BannerActionsContainer]: enabled,
          BannerActionsContainer: !enabled,
        })}
        data-primary-action="trailing"
      >
        {secondaryAction ?? null}
        {primaryAction ?? null}
      </div>
      <div
        className={clsx({
          [classes.BannerActionsContainer]: enabled,
          BannerActionsContainer: !enabled,
        })}
        data-primary-action="leading"
      >
        {primaryAction ?? null}
        {secondaryAction ?? null}
      </div>
    </div>
  )
}

export type BannerPrimaryActionProps = Omit<ButtonProps, 'variant'>

const BannerPrimaryAction = forwardRef(({children, className, ...rest}, forwardedRef) => {
  return (
    <Button ref={forwardedRef} className={clsx('BannerPrimaryAction', className)} variant="default" {...rest}>
      {children}
    </Button>
  )
}) as PolymorphicForwardRefComponent<'button', BannerPrimaryActionProps>

BannerPrimaryAction.displayName = 'BannerPrimaryAction'

export type BannerSecondaryActionProps = Omit<ButtonProps, 'variant'>

const BannerSecondaryAction = forwardRef(({children, className, ...rest}, forwardedRef) => {
  return (
    <Button ref={forwardedRef} className={clsx('BannerPrimaryAction', className)} variant="link" {...rest}>
      {children}
    </Button>
  )
}) as PolymorphicForwardRefComponent<'button', BannerSecondaryActionProps>

BannerSecondaryAction.displayName = 'BannerSecondaryAction'

export {BannerPrimaryAction, BannerSecondaryAction}
