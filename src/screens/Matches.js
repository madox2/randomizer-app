import React from 'react'
import { Text } from 'react-native'
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
    options={options}
  >
    <Text>Matches</Text>
  </SectionTemplate>
)
