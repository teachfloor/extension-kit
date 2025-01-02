import React from 'react'

import { SimpleGrid, Box, LineChart } from './ui'

/**
 * More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
 */
export default {
  title: 'LineChart',
  component: LineChart,

  /**
   * More on argTypes: https://storybook.js.org/docs/react/api/argtypes
   */
  argTypes: {},
}

const sales = [
  {
    date: 'Jan',
    sold: 5,
    profit: 11,
    region: 2
  },
  {
    date: 'Feb',
    sold: 6,
    profit: 13,
    region: 1
  },
  {
    date: 'Mar',
    sold: 7,
    profit: 15,
    region: 3
  },
  {
    date: 'Apr',
    sold: 8,
    profit: 16,
    region: 2
  },
  {
    date: 'May',
    sold: 6,
    profit: 14,
    region: 1
  },
  {
    date: 'Jun',
    sold: 9,
    profit: 17,
    region: 4
  },
  {
    date: 'Jul',
    sold: 10,
    profit: 18,
    region: 3
  },
  {
    date: 'Aug',
    sold: 11,
    profit: 19,
    region: 2
  },
  {
    date: 'Sep',
    sold: 6,
    profit: 12,
    region: 4
  },
  {
    date: 'Oct',
    sold: 7,
    profit: 14,
    region: 1
  },
  {
    date: 'Nov',
    sold: 8,
    profit: 16,
    region: 3
  },
  {
    date: 'Dec',
    sold: 9,
    profit: 17,
    region: 2
  }
]

/**
 * More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
 */
export const Example = () => (
  <SimpleGrid verticalSpacing="xl">
    <Box w={730} h={250}>
      <LineChart data={sales} x="date" y="region" />
    </Box>
    <Box w={730} h={250}>
      <LineChart data={sales} x="date" y={['sold', 'profit', 'region']} />
    </Box>
    <Box w={730} h={250}>
      <LineChart data={sales} x="date" y={{ value: 'sold', label: 'Sold' }} />
    </Box>
    <Box w={730} h={250}>
      <LineChart data={sales} x="date" y={[{ value: 'sold', label: 'Sold' }, { value: 'region', label: 'Region' }]} withLegend />
    </Box>
  </SimpleGrid>
)
