import {TriangleDownIcon} from '@primer/octicons-react'
import type {ComponentMeta} from '@storybook/react'
import React, {useState} from 'react'

import Box from '../Box'
import {Button} from '../Button'
import {QuickSelect} from '../QuickSelect'
import type {ItemInput} from '../deprecated/ActionList/List'

export default {
  title: 'Components/QuickSelect',
  component: QuickSelect,
} as ComponentMeta<typeof QuickSelect>

function getColorCircle(color: string) {
  return function () {
    return (
      <Box
        sx={{
          backgroundColor: color,
          borderColor: color,
          width: 14,
          height: 14,
          borderRadius: 10,
          margin: 'auto',
          borderWidth: '1px',
          borderStyle: 'solid',
        }}
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

export const Default = () => {
  const [selected, setSelected] = React.useState<ItemInput[]>([items[0], items[1]])
  const [filter, setFilter] = React.useState('')
  const filteredItems = items.filter(item => item.text.toLowerCase().startsWith(filter.toLowerCase()))
  const [open, setOpen] = useState(false)

  return (
    <>
      <h1>Multi Quick Select</h1>
      <QuickSelect
        title="Select labels"
        renderAnchor={({children, 'aria-labelledby': ariaLabelledBy, ...anchorProps}) => (
          <Button
            trailingAction={TriangleDownIcon}
            aria-labelledby={` ${ariaLabelledBy}`}
            {...anchorProps}
            aria-haspopup="dialog"
          >
            {children ?? 'Select Labels'}
          </Button>
        )}
        placeholderText="Filter labels"
        open={open}
        onOpenChange={setOpen}
        items={filteredItems}
        selected={selected}
        onSelectedChange={setSelected}
        onFilterChange={setFilter}
        showItemDividers={true}
        overlayProps={{width: 'small', height: 'medium'}}
      />
    </>
  )
}
