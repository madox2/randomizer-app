import React, { Component } from 'react'
import { Platform, ScrollView, Image, Animated, PanResponder } from 'react-native'
import { uniqueRandomNumbers } from '../utils/random'
import { SectionTemplate } from '../components/SectionTemplate'
import { ResponsiveStyleSheet } from 'react-native-responsive-stylesheet'
import { resource } from '../utils/image'
import { storage } from '../services/storage'

const matchSource = resource('images/match.png')
const matchBurnedSource = resource('images/match-burned.png')

const validator = options => {
  if (options.burnedCount.value >= options.count.value) {
    return 'Total count must be greater than count of burned matches'
  }
  return null
}

const MIN_PULL_LENGTH = 10

export class Matches extends Component {

  constructor(...args) {
    super(...args)
    const count = storage.getNumber('Matches.count')
    const burnedCount = storage.getNumber('Matches.burnedCount')
    this.options = {
      count: {
        type: 'number',
        label: 'Count',
        defaultValue: count,
        constraints: { min: 2, max: 50 },
      },
      burnedCount: {
        type: 'number',
        label: 'Burned',
        defaultValue: burnedCount,
        constraints: { min: 1, max: 50 },
        validator,
      },
    }
    this.state = {
      count,
      burnedCount,
      matches: this.getNewStates(count),
      burned: uniqueRandomNumbers(0, count - 1, burnedCount),
      throwNumber: 0,
    }
    this.onRefresh = this.onRefresh.bind(this)
    this.onOptionsChange = this.onOptionsChange.bind(this)
  }

  computePosition(y0, y) {
    let pos = y - y0 + this.lowerPosition
    pos < this.upperPosition && (pos = this.upperPosition)
    pos > this.lowerPosition && (pos = this.lowerPosition)
    return pos
  }

  makeMatchPanResponder(position, idx) {
    const isPulled = () => this.state.matches.find((a, i) => i === idx).pulled
    return createPanResponder({
      onStart: () => true,
      onMove: state => {
        if (isPulled()) {
          return
        }
        position.setValue(this.computePosition(state.y0, state.moveY))
      },
      onEnd: state => {
        if (isPulled()) {
          return
        }
        const pos = this.computePosition(state.y0, state.moveY)
        if (pos > this.lowerPosition - MIN_PULL_LENGTH) {
          position.setValue(this.lowerPosition)
          return
        }
        this.showMatch(idx, position)
      },
    })
  }

  getNewStates(count) {
    return new Array(count)
      .fill(false)
      .map((v, idx) => {
        const pulled = false
        const position = new Animated.Value(this.lowerPosition)
        const panResponder = this.makeMatchPanResponder(position, idx)
        return { pulled, position, panResponder }
      })
  }

  onRefresh() {
    const { count, burnedCount } = this.state
    const burned = uniqueRandomNumbers(0, count - 1, burnedCount)
    this.setState({ burned, matches: this.getNewStates(count) })
  }

  onOptionsChange({ count, burnedCount }) {
    const burned = uniqueRandomNumbers(0, count.value - 1, burnedCount.value)
    storage.set('Matches.count', count.value)
    storage.set('Matches.burnedCount', burnedCount.value)
    this.setState({
      count: count.value,
      burnedCount: burnedCount.value,
      matches: this.getNewStates(count.value),
      burned,
    })
  }

  showMatch(idx, position) {
    Animated.timing(position, {
      toValue: this.upperPosition,
      duration: 200,
    }).start(() => {
      this.setState({
        matches: this.state.matches.map((s, i) => i !== idx ? s : {
          ...s, pulled: true,
        }),
      })
    })
  }

  updateLayoutProperties(state) {
    const {
      contentHeight,
      controlsHeight,
      settingsHeight,
    } = ResponsiveStyleSheet.getProperties()
    const availableHeight = contentHeight - controlsHeight - settingsHeight
    this.matchHeight = Math.min(300, availableHeight * 0.83)
    const pullHeight = Math.min(availableHeight - this.matchHeight, this.matchHeight / 4)
    this.lowerPosition = -Math.max((availableHeight - this.matchHeight - pullHeight) / 2)
    this.upperPosition = this.lowerPosition - pullHeight
    state.matches.forEach(m => {
      m.position.setValue(m.pulled ? this.upperPosition : this.lowerPosition)
    })
  }

  componentWillMount() {
    this.updateLayoutProperties(this.state)
  }

  componentWillUpdate(nextProps, nextState) {
    this.updateLayoutProperties(nextState)
  }

  render() {
    const { throwNumber, matches, burned } = this.state
    const s = makeStyles({ matchHeight: this.matchHeight, matchCount: matches.length })
    return (
      <SectionTemplate
        {...this.props}
        onRefresh={this.onRefresh}
        options={this.options}
        onOptionsChange={this.onOptionsChange}
        title='Matches'
        style={s.container}
      >
        <ScrollView
          contentContainerStyle={s.scrollView}
          horizontal={true}
        >
          {matches.map((match, i) => (
            <Animated.View
              key={`${throwNumber}-${i}`}
              {...match.panResponder.panHandlers}
              style={[s.imageContainer, {
                transform: [{ translateY: match.position }],
              }]}
            >
              <Image
                style={s.imageMatch}
                source={match.pulled && ~burned.indexOf(i) ? matchBurnedSource : matchSource}
              />
            </Animated.View>
          ))}
        </ScrollView>
      </SectionTemplate>
    )
  }

}

const makeStyles = ResponsiveStyleSheet.create(({
  contentWidth,
  controlsHeight,
  matchHeight,
  contentPadding,
  matchCount,
}) => {
  const matchWidth = matchHeight / 10.14
  let matchPadding = contentWidth * 0.02
  if (matchCount * (matchWidth + 2 * matchPadding) > contentWidth) {
    // TODO: display scroll info
  }
  return ({
    container: {
      alignItems: 'center',
    },
    scrollView: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'center',
      flexWrap: 'wrap',
      marginBottom: controlsHeight - contentPadding,
    },
    imageContainer: {
      paddingLeft: matchPadding,
      paddingRight: matchPadding,
      height: matchHeight,
    },
    imageMatch: {
      position: 'relative',
      resizeMode: 'stretch',
      height: matchHeight,
      width: matchWidth,
      bottom: 0,
    },
  })
})

const createPanResponder = ({ onStart, onMove, onEnd, onStartShouldSetPanResponder }) => PanResponder.create({
  onStartShouldSetPanResponder: onStartShouldSetPanResponder,
  onStartShouldSetPanResponderCapture: () => Platform.OS === 'web',
  onMoveShouldSetPanResponderCapture: () => Platform.OS !== 'web',
  onPanResponderTerminationRequest: () => true,
  onPanResponderGrant: (evt, state) => onStart(state),
  onPanResponderMove: (evt, state) => onMove(state),
  onPanResponderRelease: (evt, state) => onEnd(state),
})
