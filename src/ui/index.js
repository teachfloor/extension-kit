import React from 'react'

import {
  Button as ButtonUI,
  Badge as BadgeUI,
  Checkbox as CheckboxUI,
  Divider as DividerUI,
  Image as ImageUI,
  Radio as RadioUI,
  Select as SelectUI,
  Switch as SwitchUI,
  Textarea as TextareaUI,
  TextInput as TextInputUI,
  PasswordInput as PasswordInputUI,
  NumberInput as NumberInputUI,
  MultiSelect as MultiSelectUI,
  ColorInput as ColorInputUI,
  Chip as ChipUI,
  Tooltip as TooltipUI,
  Text as TextUI,
  Avatar as AvatarUI,
  Loader as LoaderUI,

  Container as ContainerUI,
  Box as BoxUI,
  Group as GroupUI,
  Grid as GridUI,
  SimpleGrid as SimpleGridUI,
  Stack as StackUI,

  Tabs as TabsUI,
} from '@teachfloor/ui-kit'

/**
 * Extension App Components
 */
export * from './ExtensionViewLoader'

/**
 * Layout
 */
export const Container = ContainerUI
export const Box = BoxUI
export const Grid = GridUI
export const Group = GroupUI
export const SimpleGrid = SimpleGridUI
export const Stack = StackUI
export const Divider = DividerUI

/**
 * Navigation
 */
export const Button = ButtonUI
export const ButtonGroup = ButtonUI.Group
export const Tabs = TabsUI

/**
 * Content
 */
export const Badge = BadgeUI
export const Image = ImageUI
export const Chip = ChipUI
export const Tooltip = TooltipUI
export const Text = TextUI
export const Avatar = (props) => <AvatarUI radius="xl" {...props} />
export const Loader = LoaderUI

/**
 * Forms
 */
export const Checkbox = CheckboxUI
export const Radio = RadioUI
export const Select = SelectUI
export const Switch = SwitchUI
export const Textarea = TextareaUI
export const TextInput = TextInputUI
export const PasswordInput = PasswordInputUI
export const NumberInput = NumberInputUI
export const MultiSelect = MultiSelectUI
export const ColorInput = ColorInputUI

/**
 * Charts
 */
