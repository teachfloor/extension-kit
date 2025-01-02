import React from 'react'

import { Box, BarChart } from './ui'

/**
 * More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
 */
export default {
  title: 'BarChart',
  component: BarChart,

  /**
   * More on argTypes: https://storybook.js.org/docs/react/api/argtypes
   */
  argTypes: {},
}

const sales = [
  {
    date: 'Jan',
    sold: 5,
  },
  {
    date: 'Feb',
    sold: 6,
  },
  {
    date: 'Mar',
    sold: 7,
  },
  {
    date: 'Apr',
    sold: 8,
  },
  {
    date: 'May',
    sold: 6,
  },
  {
    date: 'Jun',
    sold: 9,
  },
  {
    date: 'Jul',
    sold: 10,
  },
  {
    date: 'Aug',
    sold: 11,
  },
  {
    date: 'Sep',
    sold: 6,
  },
  {
    date: 'Oct',
    sold: 7,
  },
  {
    date: 'Nov',
    sold: 8,
  },
  {
    date: 'Dec',
    sold: 9,
  }
]



/**
 * More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
 */
export const Example = () => (
  <Box w={730} h={250}>
    <BarChart data={sales} x="date" y={'sold'} withTooltip />
  </Box>
)
