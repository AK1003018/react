import React, {type FC, type PropsWithChildren} from 'react'
import styled from 'styled-components'
import {get} from '../../constants'
import type {SxProp} from '../../sx'
import sx from '../../sx'
import type {ComponentProps} from '../../utils/types'

const FilterListBase = styled.ul<SxProp>`
  list-style-type: none;
  margin: 0;
  padding: 0;
  ${sx};
`

export type FilterListProps = ComponentProps<typeof FilterListBase>

/**
 * @deprecated Use the ActionList component instead.
 * The FilterList component is a menu with filter options that filter the main content of the page.
 * @primerid filter_list
 * @primerstatus deprecated
 * @primera11yreviewed false
 */
export const FilterList = ({children, ...rest}: React.PropsWithChildren<FilterListProps>) => {
  const items = React.Children.map(children, child => {
    return <li>{child}</li>
  })

  return <FilterListBase {...rest}>{items}</FilterListBase>
}

type StyledFilterListItemBaseProps = {
  small?: boolean
  selected?: boolean
} & SxProp

const FilterListItemBase = styled.a<StyledFilterListItemBaseProps>`
  position: relative;
  display: block;
  padding: ${props => (props.small ? `${get('space.1')(props)} 10px` : `${get('space.2')(props)} 11px`)};
  margin: ${props => (props.small ? '0 0 2px' : '0 0 5px 0')};
  overflow: hidden;
  font-size: ${get('fontSizes.1')};
  color: ${props => (props.selected ? get('colors.fg.onEmphasis') : get('colors.fg.muted'))};
  background-color: ${props => (props.selected ? get('colors.accent.emphasis') : '')}!important;
  text-decoration: none;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  border-radius: ${get('radii.1')};
  &:hover {
    text-decoration: none;
    background-color: ${get('colors.canvas.subtle')};
  }
  &:active {
    color: ${get('colors.fg.onEmphasis')};
    background-color: ${get('colors.accent.emphasis')};
  }
  .count {
    float: right;
    font-weight: ${get('fontWeights.bold')};
  }
  ${sx};
`

export type FilterListItemProps = {count?: number} & ComponentProps<typeof FilterListItemBase>

/**
 * An item that activates a filter when activated.
 * @alias FilterList.Item
 * @primerparentid filter_list
 */
export const FilterListItem: FC<PropsWithChildren<FilterListItemProps>> = ({children, count, ...rest}) => {
  return (
    <FilterListItemBase {...rest}>
      {count && <span className="count">{count}</span>}
      {children}
    </FilterListItemBase>
  )
}
