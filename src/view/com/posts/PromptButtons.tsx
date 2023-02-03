import React from 'react'
import {StyleSheet, TouchableOpacity, View} from 'react-native'
import {Text} from '../util/text/Text'
import {usePalette} from '../../lib/hooks/usePalette'
import {useAnalytics} from '@segment/analytics-react-native'

export function PromptButtons({
  onPressCompose,
}: {
  onPressCompose: (imagesOpen?: boolean) => void
}) {
  const pal = usePalette('default')
  const {track} = useAnalytics()

  const onPressNewPost = () => {
    track('PromptButtons:NewPost')
    onPressCompose(false)
  }

  const onPressSharePhoto = () => {
    track('PromptButtons:SharePhoto')
    onPressCompose(true)
  }
  return (
    <View style={[pal.view, pal.border, styles.container]}>
      <TouchableOpacity
        testID="composePromptButton"
        onPress={onPressNewPost}
        style={[styles.btn, {backgroundColor: pal.colors.backgroundLight}]}>
        <Text type="button" style={pal.text}>
          New post
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onPressSharePhoto}
        style={[styles.btn, {backgroundColor: pal.colors.backgroundLight}]}>
        <Text type="button" style={pal.text}>
          Share photo
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
  },
  btn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 30,
    marginRight: 10,
  },
})
