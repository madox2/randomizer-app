import React from 'react'
import {Modal as NativeModal} from 'react-native'

export const Modal = ({children, onRequestClose}) => (
  <NativeModal
    animationType={'slide'}
    transparent={false}
    visible={true}
    onRequestClose={onRequestClose}>
    {children}
  </NativeModal>
)
