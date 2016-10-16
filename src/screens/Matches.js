import React from 'react'
import { SectionTemplate } from '../components/SectionTemplate'

const options = {
  count: {
    type: 'number',
    label: 'Count',
    defaultValue: 4,
  },
}

export const Matches = () => (
  <SectionTemplate
    title='Matches'
    options={options}
  >
  </SectionTemplate>
)
