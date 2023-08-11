import React, {useContext} from 'react'
import Box from '../Box'
import Checkbox from '../Checkbox'
import Radio from '../Radio'
import {get} from '../constants'
import {useSlots} from '../hooks/useSlots'
import {CheckboxOrRadioGroupContext} from '../internal/components/CheckboxOrRadioGroup'
import ValidationAnimationContainer from '../internal/components/ValidationAnimationContainer'
import {SxProp} from '../sx'
import {useSSRSafeId} from '../utils/ssr'
import FormControlCaption from './_FormControlCaption'
import FormControlLabel from './_FormControlLabel'
import FormControlLeadingVisual from './_FormControlLeadingVisual'
import FormControlValidation from './_FormControlValidation'
import {autoWirable, isValidAutoWirableElement} from './auto-wirable'

export type FormControlProps = {
  children?: React.ReactNode
  /**
   * Whether the control allows user input
   */
  disabled?: boolean
  /**
   * The unique identifier for this control. Used to associate the label, validation text, and caption text
   */
  id?: string
  /**
   * If true, the user must specify a value for the input before the owning form can be submitted
   */
  required?: boolean
  /**
   * The direction the content flows.
   * Vertical layout is used by default, and horizontal layout is used for checkbox and radio inputs.
   */
  layout?: 'horizontal' | 'vertical'
} & SxProp

export interface FormControlContext extends Pick<FormControlProps, 'disabled' | 'id' | 'required'> {
  captionId?: string
  validationMessageId?: string
}

export const FormControlContext = React.createContext<FormControlContext>({})

const FormControl = React.forwardRef<HTMLDivElement, FormControlProps>(
  ({children, disabled: disabledProp, layout = 'vertical', id: idProp, required, sx}, ref) => {
    const [slots, childrenWithoutSlots] = useSlots(children, {
      caption: FormControlCaption,
      label: FormControlLabel,
      leadingVisual: FormControlLeadingVisual,
      validation: FormControlValidation,
    })
    const choiceGroupContext = useContext(CheckboxOrRadioGroupContext)
    const disabled = choiceGroupContext.disabled || disabledProp
    const id = useSSRSafeId(idProp)
    const validationMessageId = slots.validation ? `${id}-validationMessage` : undefined
    const captionId = slots.caption ? `${id}-caption` : undefined
    const validationStatus = slots.validation?.props.variant
    const InputComponent = childrenWithoutSlots.find(isValidAutoWirableElement)

    // we don't make the mark symbol public, so TS thinks it's impossible that the types could overlap
    const isChoiceInput =
      InputComponent && ((InputComponent.type as unknown) === Checkbox || (InputComponent.type as unknown) === Radio)

    if (InputComponent) {
      const inputProps = InputComponent.props
      if (inputProps.id) {
        // eslint-disable-next-line no-console
        console.warn(
          `instead of passing the 'id' prop directly to the input component, it should be passed to the parent component, <FormControl>`,
        )
      }
      if (inputProps.disabled) {
        // eslint-disable-next-line no-console
        console.warn(
          `instead of passing the 'disabled' prop directly to the input component, it should be passed to the parent component, <FormControl>`,
        )
      }
      if (inputProps.required) {
        // eslint-disable-next-line no-console
        console.warn(
          `instead of passing the 'required' prop directly to the input component, it should be passed to the parent component, <FormControl>`,
        )
      }
    }

    if (!slots.label) {
      // eslint-disable-next-line no-console
      console.error(
        `The input field with the id ${id} MUST have a FormControl.Label child.\n\nIf you want to hide the label, pass the 'visuallyHidden' prop to the FormControl.Label component.`,
      )
    }

    if (isChoiceInput) {
      if (slots.validation) {
        // eslint-disable-next-line no-console
        console.warn(
          'Validation messages are not rendered for an individual checkbox or radio. The validation message should be shown for all options.',
        )
      }

      if (childrenWithoutSlots.find(child => React.isValidElement(child) && child.props?.required)) {
        // eslint-disable-next-line no-console
        console.warn('An individual checkbox or radio cannot be a required field.')
      }
    } else {
      if (slots.leadingVisual) {
        // eslint-disable-next-line no-console
        console.warn(
          'A leading visual is only rendered for a checkbox or radio form control. If you want to render a leading visual inside of your input, check if your input supports a leading visual.',
        )
      }
    }

    const isLabelHidden = slots.label?.props.visuallyHidden

    return (
      <FormControlContext.Provider
        value={{
          captionId,
          disabled,
          id,
          required,
          validationMessageId,
        }}
      >
        {isChoiceInput || layout === 'horizontal' ? (
          <Box ref={ref} display="flex" alignItems={slots.leadingVisual ? 'center' : undefined} sx={sx}>
            <Box sx={{'> input': {marginLeft: 0, marginRight: 0}}}>
              {React.isValidElement(InputComponent) &&
                React.cloneElement(
                  InputComponent as React.ReactElement<{
                    id: string
                    disabled: boolean
                    ['aria-describedby']: string
                  }>,
                  {
                    id,
                    disabled,
                    ['aria-describedby']: captionId as string,
                  },
                )}
              {childrenWithoutSlots.filter(
                child =>
                  React.isValidElement(child) &&
                  ![Checkbox, Radio].some(inputComponent => child.type === inputComponent),
              )}
            </Box>
            {slots.leadingVisual && (
              <Box
                color={disabled ? 'fg.muted' : 'fg.default'}
                sx={{
                  '> *': {
                    minWidth: slots.caption ? get('fontSizes.4') : get('fontSizes.2'),
                    minHeight: slots.caption ? get('fontSizes.4') : get('fontSizes.2'),
                    fill: 'currentColor',
                  },
                }}
                ml={2}
              >
                {slots.leadingVisual}
              </Box>
            )}
            {!slots.label?.props.visuallyHidden || slots.caption ? (
              <Box display="flex" flexDirection="column" ml={2}>
                {slots.label}
                {slots.caption}
              </Box>
            ) : (
              <>
                {slots.label}
                {slots.caption}
              </>
            )}
          </Box>
        ) : (
          <Box
            ref={ref}
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
            sx={{...(isLabelHidden ? {'> *:not(label) + *': {marginTop: 1}} : {'> * + *': {marginTop: 1}}), ...sx}}
          >
            {slots.label}
            {InputComponent &&
              React.cloneElement(InputComponent, {
                id,
                required,
                disabled,
                validationStatus,
                ['aria-describedby']: [validationMessageId, captionId].filter(Boolean).join(' '),
                ...InputComponent.props,
              })}
            {childrenWithoutSlots.filter(child => child !== InputComponent)}
            {slots.validation ? (
              <ValidationAnimationContainer show>{slots.validation}</ValidationAnimationContainer>
            ) : null}
            {slots.caption}
          </Box>
        )}
      </FormControlContext.Provider>
    )
  },
)

export default Object.assign(FormControl, {
  Caption: FormControlCaption,
  Label: FormControlLabel,
  LeadingVisual: FormControlLeadingVisual,
  Validation: FormControlValidation,
  autoWirable,
})
