import React, {useState, useRef} from 'react'
import type {Args, Meta} from '@storybook/react'
import {XIcon} from '@primer/octicons-react'
import {Overlay, Button, Text, useFocusTrap, Box, IconButton} from '..'

export default {
  title: 'Private/Components/Overlay',
  component: Overlay,
} as Meta

export const Default = () => {
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const confirmButtonRef = useRef<HTMLButtonElement>(null)
  const anchorRef = useRef<HTMLDivElement>(null)
  const closeOverlay = () => setIsOpen(false)

  const containerRef = useRef<HTMLDivElement>(null)

  useFocusTrap({
    containerRef,
    disabled: !isOpen,
  })

  return (
    <Box ref={anchorRef}>
      <Button
        ref={buttonRef}
        onClick={() => {
          setIsOpen(!isOpen)
        }}
      >
        Open overlay
      </Button>

      {isOpen ? (
        <Overlay
          initialFocusRef={confirmButtonRef}
          returnFocusRef={buttonRef}
          ignoreClickRefs={[buttonRef]}
          onEscape={closeOverlay}
          onClickOutside={closeOverlay}
          width="auto"
          anchorSide="inside-right"
          role="dialog"
          aria-modal="true"
          ref={containerRef}
        >
          <Box>
            <Box
              sx={{
                height: '100vh',
                maxWidth: 'calc(-1rem + 100vw)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <IconButton
                aria-label="Close"
                onClick={closeOverlay}
                icon={XIcon}
                variant="invisible"
                sx={{
                  position: 'absolute',
                  left: '5px',
                  top: '5px',
                }}
              />
              <Text>Look! an overlay</Text>
            </Box>
          </Box>
        </Overlay>
      ) : null}
    </Box>
  )
}

export const Playground = (args: Args) => {
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const confirmButtonRef = useRef<HTMLButtonElement>(null)
  const anchorRef = useRef<HTMLDivElement>(null)
  const closeOverlay = () => setIsOpen(false)

  const containerRef = useRef<HTMLDivElement>(null)

  useFocusTrap({
    containerRef,
    disabled: !isOpen,
  })

  return (
    <Box ref={anchorRef}>
      <Button
        ref={buttonRef}
        onClick={() => {
          setIsOpen(!isOpen)
        }}
      >
        Open overlay
      </Button>
      {isOpen ? (
        <Overlay
          initialFocusRef={confirmButtonRef}
          returnFocusRef={buttonRef}
          ignoreClickRefs={[buttonRef]}
          onEscape={closeOverlay}
          onClickOutside={closeOverlay}
          width={args.width}
          height={args.height}
          role="dialog"
          aria-modal="true"
          ref={containerRef}
          {...args}
        >
          <Box
            sx={{
              width: ['350px', '500px'],
            }}
          >
            <Box
              sx={{
                height: '100vh',
                maxWidth: 'calc(-1rem + 100vw)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <IconButton
                aria-label="Close"
                onClick={closeOverlay}
                icon={XIcon}
                variant="invisible"
                sx={{
                  position: 'absolute',
                  left: '5px',
                  top: '5px',
                }}
              />
              <Text>Look! an overlay</Text>
            </Box>
          </Box>
        </Overlay>
      ) : null}
    </Box>
  )
}
Playground.args = {
  width: 'auto',
  height: 'auto',
  side: 'outside-bottom',
}
Playground.argTypes = {
  width: {
    type: {
      name: 'enum',
      value: ['small', 'medium', 'large', 'xlarge', 'xxlarge', 'auto'],
    },
  },
  height: {
    type: {
      name: 'enum',
      value: ['xsmall', 'small', 'medium', 'large', 'xlarge', 'auto', 'initial'],
    },
  },
  side: {
    type: {
      name: 'enum',
      value: [
        'inside-top',
        'inside-bottom',
        'inside-left',
        'inside-right',
        'inside-center',
        'outside-top',
        'outside-bottom',
        'outside-left',
        'outside-right',
      ],
    },
  },
  open: {
    control: false,
  },
  portalContainerName: {
    control: false,
  },
}
