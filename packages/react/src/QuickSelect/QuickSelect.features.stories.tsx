import React, {useState, useRef} from 'react'
import type {ComponentMeta} from '@storybook/react'

import Box from '../Box'
import {Button} from '../Button'
import type {ItemInput} from '../deprecated/ActionList/List'
import {QuickSelect} from './QuickSelect'
import {TriangleDownIcon} from '@primer/octicons-react'
import type {OverlayProps} from '../Overlay'

export default {
  title: 'Components/QuickSelect/Features',
  component: QuickSelect,
} as ComponentMeta<typeof QuickSelect>

function getColorCircle(color: string) {
  return function () {
    return (
      <Box
        bg={color}
        borderColor={color}
        width={14}
        height={14}
        borderRadius={10}
        margin="auto"
        borderWidth="1px"
        borderStyle="solid"
      />
    )
  }
}

const items = [
  {leadingVisual: getColorCircle('#a2eeef'), text: 'enhancement', id: 1},
  {leadingVisual: getColorCircle('#d73a4a'), text: 'bug', id: 2},
  {leadingVisual: getColorCircle('#0cf478'), text: 'good first issue', id: 3},
  {leadingVisual: getColorCircle('#ffd78e'), text: 'design', id: 4},
  {leadingVisual: getColorCircle('#ff0000'), text: 'blocker', id: 5},
  {leadingVisual: getColorCircle('#a4f287'), text: 'backend', id: 6},
  {leadingVisual: getColorCircle('#8dc6fc'), text: 'frontend', id: 7},
]

export const SingleSelectStory = () => {
  const [selected, setSelected] = React.useState<ItemInput | undefined>(items[0])
  const [filter, setFilter] = React.useState('')
  const filteredItems = items.filter(item => item.text.toLowerCase().startsWith(filter.toLowerCase()))
  const [open, setOpen] = useState(false)

  return (
    <>
      <h1>Single Quick Select</h1>
      <div>Please select a label that describe your issue:</div>
      <QuickSelect
        renderAnchor={({children, 'aria-labelledby': ariaLabelledBy, ...anchorProps}) => (
          <Button trailingAction={TriangleDownIcon} aria-labelledby={` ${ariaLabelledBy}`} {...anchorProps}>
            {children ?? 'Select Labels'}
          </Button>
        )}
        placeholderText="Filter Labels"
        open={open}
        onOpenChange={setOpen}
        items={filteredItems}
        selected={selected}
        onSelectedChange={setSelected}
        onFilterChange={setFilter}
        showItemDividers={true}
        overlayProps={{width: 'small', height: 'xsmall'}}
      />
    </>
  )
}
SingleSelectStory.storyName = 'Single Select'

export const ExternalAnchorStory = () => {
  const [selected, setSelected] = React.useState<ItemInput | undefined>(items[0])
  const [filter, setFilter] = React.useState('')
  const filteredItems = items.filter(item => item.text.toLowerCase().startsWith(filter.toLowerCase()))
  const [open, setOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  return (
    <>
      <h1>Quick Select With External Anchor</h1>
      <Button trailingAction={TriangleDownIcon} ref={buttonRef} onClick={() => setOpen(!open)}>
        Custom: {selected?.text || 'Click Me'}
      </Button>
      <QuickSelect
        renderAnchor={null}
        anchorRef={buttonRef}
        placeholderText="Filter Labels"
        open={open}
        onOpenChange={setOpen}
        items={filteredItems}
        selected={selected}
        onSelectedChange={setSelected}
        onFilterChange={setFilter}
        showItemDividers={true}
        overlayProps={{width: 'small', height: 'xsmall'}}
      />
    </>
  )
}
ExternalAnchorStory.storyName = 'With External Anchor'

export const QuickSelectHeightInitialWithOverflowingItemsStory = () => {
  const [selected, setSelected] = React.useState<ItemInput | undefined>(items[0])
  const [filter, setFilter] = React.useState('')
  const filteredItems = items.filter(item => item.text.toLowerCase().startsWith(filter.toLowerCase()))
  const [open, setOpen] = useState(false)

  return (
    <>
      <h1>Single Quick Select</h1>
      <div>Please select a label that describe your issue:</div>
      <QuickSelect
        renderAnchor={({children, 'aria-labelledby': ariaLabelledBy, ...anchorProps}) => (
          <Button trailingAction={TriangleDownIcon} aria-labelledby={` ${ariaLabelledBy}`} {...anchorProps}>
            {children ?? 'Select Labels'}
          </Button>
        )}
        placeholderText="Filter Labels"
        open={open}
        onOpenChange={setOpen}
        items={filteredItems}
        selected={selected}
        onSelectedChange={setSelected}
        onFilterChange={setFilter}
        showItemDividers={true}
        overlayProps={{width: 'small', height: 'initial', maxHeight: 'xsmall'}}
      />
    </>
  )
}
QuickSelectHeightInitialWithOverflowingItemsStory.storyName = 'QuickSelect, Height: Initial, Overflowing Items'

export const QuickSelectHeightInitialWithUnderflowingItemsStory = () => {
  const underflowingItems = [items[0], items[1]]
  const [selected, setSelected] = React.useState<ItemInput | undefined>(underflowingItems[0])
  const [filter, setFilter] = React.useState('')
  const filteredItems = underflowingItems.filter(item => item.text.toLowerCase().startsWith(filter.toLowerCase()))
  const [open, setOpen] = useState(false)

  return (
    <>
      <h1>Single Quick Select</h1>
      <div>Please select a label that describe your issue:</div>
      <QuickSelect
        renderAnchor={({children, 'aria-labelledby': ariaLabelledBy, ...anchorProps}) => (
          <Button trailingAction={TriangleDownIcon} aria-labelledby={` ${ariaLabelledBy}`} {...anchorProps}>
            {children ?? 'Select Labels'}
          </Button>
        )}
        placeholderText="Filter Labels"
        open={open}
        onOpenChange={setOpen}
        items={filteredItems}
        selected={selected}
        onSelectedChange={setSelected}
        onFilterChange={setFilter}
        showItemDividers={true}
        overlayProps={{width: 'small', height: 'initial', maxHeight: 'xsmall'}}
      />
    </>
  )
}
QuickSelectHeightInitialWithUnderflowingItemsStory.storyName = 'QuickSelect, Height: Initial, Underflowing Items'

export const QuickSelectHeightInitialWithUnderflowingItemsAfterFetch = () => {
  const [selected, setSelected] = React.useState<ItemInput | undefined>(items[0])
  const [filter, setFilter] = React.useState('')
  const [fetchedItems, setFetchedItems] = useState<typeof items>([])
  const filteredItems = React.useMemo(
    () => fetchedItems.filter(item => item.text.toLowerCase().startsWith(filter.toLowerCase())),
    [fetchedItems, filter],
  )
  const [open, setOpen] = useState(false)
  const [height, setHeight] = useState<OverlayProps['height']>('auto')

  const onOpenChange = () => {
    setOpen(!open)
    setTimeout(() => {
      setFetchedItems([items[0], items[1]])
      setHeight('initial')
    }, 1500)
  }

  return (
    <>
      <h1>Single Quick Select</h1>
      <div>Please select a label that describe your issue:</div>
      <QuickSelect
        renderAnchor={({children, 'aria-labelledby': ariaLabelledBy, ...anchorProps}) => (
          <Button trailingAction={TriangleDownIcon} aria-labelledby={` ${ariaLabelledBy}`} {...anchorProps}>
            {children ?? 'Select Labels'}
          </Button>
        )}
        placeholderText="Filter Labels"
        open={open}
        onOpenChange={onOpenChange}
        loading={filteredItems.length === 0}
        items={filteredItems}
        selected={selected}
        onSelectedChange={setSelected}
        onFilterChange={setFilter}
        showItemDividers={true}
        overlayProps={{width: 'small', height, maxHeight: 'xsmall'}}
      />
    </>
  )
}
QuickSelectHeightInitialWithUnderflowingItemsAfterFetch.storyName =
  'QuickSelect, Height: Initial, Underflowing Items (After Fetch)'

export const QuickSelectAboveTallBody = () => {
  const [selected, setSelected] = React.useState<ItemInput | undefined>(items[0])
  const [filter, setFilter] = React.useState('')
  const filteredItems = items.filter(item => item.text.toLowerCase().startsWith(filter.toLowerCase()))
  const [open, setOpen] = useState(false)

  return (
    <>
      <h1>Single Quick Select</h1>
      <div>Please select a label that describe your issue:</div>
      <QuickSelect
        renderAnchor={({children, 'aria-labelledby': ariaLabelledBy, ...anchorProps}) => (
          <Button trailingAction={TriangleDownIcon} aria-labelledby={` ${ariaLabelledBy}`} {...anchorProps}>
            {children ?? 'Select Labels'}
          </Button>
        )}
        placeholderText="Filter Labels"
        open={open}
        onOpenChange={setOpen}
        items={filteredItems}
        selected={selected}
        onSelectedChange={setSelected}
        onFilterChange={setFilter}
        showItemDividers={true}
        overlayProps={{width: 'small', height: 'xsmall'}}
      />
      <div
        style={{
          backgroundColor: 'cornflowerblue',
          height: '100vh',
        }}
      >
        This element makes the body really tall. This is to test that we do not have layout/focus issues if the Portal
        is far down the page
      </div>
    </>
  )
}
QuickSelectAboveTallBody.storyName = 'QuickSelect, Above a Tall Body'

export const QuickSelectHeightAndScroll = () => {
  const longItems = [...items, ...items, ...items, ...items, ...items, ...items, ...items, ...items]
  const [selectedA, setSelectedA] = React.useState<ItemInput | undefined>(longItems[0])
  const [selectedB, setSelectedB] = React.useState<ItemInput | undefined>(longItems[0])
  const [filter, setFilter] = React.useState('')
  const filteredItems = longItems.filter(item => item.text.toLowerCase().startsWith(filter.toLowerCase()))
  const [openA, setOpenA] = useState(false)
  const [openB, setOpenB] = useState(false)

  return (
    <>
      <h2>With height:medium</h2>
      <QuickSelect
        renderAnchor={({children, 'aria-labelledby': ariaLabelledBy, ...anchorProps}) => (
          <Button trailingAction={TriangleDownIcon} aria-labelledby={` ${ariaLabelledBy}`} {...anchorProps}>
            {children ?? 'Select Labels'}
          </Button>
        )}
        placeholderText="Filter Labels"
        open={openA}
        onOpenChange={setOpenA}
        items={filteredItems}
        selected={selectedA}
        onSelectedChange={setSelectedA}
        onFilterChange={setFilter}
        showItemDividers={true}
        overlayProps={{height: 'medium'}}
      />
      <h2>With height:auto, maxheight:medium</h2>
      <QuickSelect
        renderAnchor={({children, 'aria-labelledby': ariaLabelledBy, ...anchorProps}) => (
          <Button trailingAction={TriangleDownIcon} aria-labelledby={` ${ariaLabelledBy}`} {...anchorProps}>
            {children ?? 'Select Labels'}
          </Button>
        )}
        placeholderText="Filter Labels"
        open={openB}
        onOpenChange={setOpenB}
        items={filteredItems}
        selected={selectedB}
        onSelectedChange={setSelectedB}
        onFilterChange={setFilter}
        showItemDividers={true}
        overlayProps={{
          height: 'auto',
          maxHeight: 'medium',
        }}
      />
    </>
  )
}
QuickSelectHeightAndScroll.storyName = 'QuickSelect, Height and Scroll'
