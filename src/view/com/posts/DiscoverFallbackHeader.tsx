import React from 'react'
import {View} from 'react-native'
import {Trans} from '@lingui/macro'
import {Text} from '../util/text/Text'
import {usePalette} from '#/lib/hooks/usePalette'
import {TextLink} from '../util/Link'
import {InfoCircleIcon} from '#/lib/icons'

export function DiscoverFallbackHeader() {
  const pal = usePalette('default')
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 12,
          paddingHorizontal: 12,
          borderTopWidth: 1,
        },
        pal.border,
        pal.viewLight,
      ]}>
      <View style={{width: 68, paddingLeft: 12}}>
        <InfoCircleIcon size={36} style={pal.textLight} strokeWidth={1.5} />
      </View>
      <View style={{flex: 1}}>
        <Text type="md" style={pal.text}>
          <Trans>
            We ran out of posts from your follows. Here's the latest from
          </Trans>{' '}
          <TextLink
            type="md-medium"
            href="/profile/bsky.app/feed/whats-hot"
            text="Discover"
            style={pal.link}
          />
          .
        </Text>
      </View>
    </View>
  )
}
