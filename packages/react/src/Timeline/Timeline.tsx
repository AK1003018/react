import {clsx} from 'clsx'
import React from 'react'
import styled, {css} from 'styled-components'
import Box from '../Box'
import {get} from '../constants'
import type {SxProp} from '../sx'
import sx from '../sx'
import type {ComponentProps} from '../utils/types'

/**
 * The timeline component is used to display items on a vertical timeline, connected by timeline elements.
 * @primerid timeline
 * @primerstatus alpha
 * @primera11yreviewed false
 */
export const Timeline = styled.div<
  {
    /** Hides the sidebar above the first Timeline.Item and below the last Timeline.Item. */
    clipSidebar?: boolean
  } & SxProp
>`
  display: flex;
  flex-direction: column;
  ${props =>
    props.clipSidebar &&
    css`
      .Timeline-Item:first-child {
        padding-top: 0;
      }

      .Timeline-Item:last-child {
        padding-bottom: 0;
      }
    `}

  ${sx};
`

type StyledTimelineItemProps = {
  /** Reduces vertical padding and removes background from an item's badge. */
  condensed?: boolean
} & SxProp

/**
 * An individual item on a timeline.
 * @alias Timeline.Item
 * @primerparentid timeline
 */
export const TimelineItem = styled.div.attrs<StyledTimelineItemProps>(props => ({
  className: clsx('Timeline-Item', props.className),
}))<StyledTimelineItemProps>`
  display: flex;
  position: relative;
  padding: ${get('space.3')} 0;
  margin-left: ${get('space.3')};

  &::before {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    display: block;
    width: 2px;
    content: '';
    background-color: ${get('colors.border.muted')};
  }

  ${props =>
    props.condensed &&
    css`
      padding-top: ${get('space.1')};
      padding-bottom: 0;
      &:last-child {
        padding-bottom: ${get('space.3')};
      }

      .TimelineItem-Badge {
        height: 16px;
        margin-top: ${get('space.2')};
        margin-bottom: ${get('space.2')};
        color: ${get('colors.fg.muted')};
        background-color: ${get('colors.canvas.default')};
        border: 0;
      }
    `}

  ${sx};
`

export type TimelineBadgeProps = {children?: React.ReactNode} & SxProp

/**
 * The "badge" that prepends a timeline item's body content.
 * @alias Timeline.Badge
 * @primerparentid timeline
 */
export const TimelineBadge: React.FC<React.PropsWithChildren<TimelineBadgeProps>> = props => {
  return (
    <Box position="relative" zIndex={1}>
      <Box
        display="flex"
        className="TimelineItem-Badge"
        flexShrink={0}
        borderRadius="50%"
        borderWidth="2px"
        borderStyle="solid"
        borderColor="canvas.default"
        overflow="hidden"
        color="fg.muted"
        bg="timeline.badgeBg"
        width="32px"
        height="32px"
        mr={2}
        ml="-15px"
        alignItems="center"
        justifyContent="center"
        sx={props.sx}
      >
        {props.children}
      </Box>
    </Box>
  )
}

/**
 * A timeline item's body content.
 * @alias Timeline.Body
 * @primerparentid timeline
 */
export const TimelineBody = styled.div<SxProp>`
  min-width: 0;
  max-width: 100%;
  margin-top: ${get('space.1')};
  color: ${get('colors.fg.muted')};
  flex: auto;
  font-size: ${get('fontSizes.1')};
  ${sx};
`

/**
 * A visual break in the timeline.
 * @alias Timeline.Break
 * @primerparentid timeline
 */
export const TimelineBreak = styled.div<SxProp>`
  position: relative;
  z-index: 1;
  height: 24px;
  margin: 0;
  margin-bottom: -${get('space.3')};
  margin-left: 0;
  background-color: ${get('colors.canvas.default')};
  border: 0;
  border-top: ${get('space.1')} solid ${get('colors.border.default')};
  ${sx};
`

TimelineItem.displayName = 'Timeline.Item'

TimelineBadge.displayName = 'Timeline.Badge'

TimelineBody.displayName = 'Timeline.Body'

TimelineBreak.displayName = 'Timeline.Break'

export type TimelineProps = ComponentProps<typeof Timeline>
export type TimelineItemsProps = ComponentProps<typeof TimelineItem>
export type TimelineBodyProps = ComponentProps<typeof TimelineBody>
export type TimelineBreakProps = ComponentProps<typeof TimelineBreak>
