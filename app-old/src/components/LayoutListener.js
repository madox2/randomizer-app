import React, {Component} from 'react'
import {View, StyleSheet} from 'react-native'

export class LayoutListener extends Component {
  constructor(...args) {
    super(...args)
    // onLayout is not implemented for react native web
    if (window && window.addEventListener) {
      window.addEventListener(
        'resize',
        () => {
          // react native for web is debouncing Dimensions with 50ms
          setTimeout(this.props.onLayout, 50)
        },
        true,
      )
    }
  }

  render() {
    return (
      <View style={styles.container} onLayout={this.props.onLayout}>
        {this.props.children}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
