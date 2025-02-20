import React from 'react'
import {LayoutAnimation, Pressable, StyleSheet, View} from 'react-native'
import {Image} from 'expo-image'
import {useLingui} from '@lingui/react'
import {msg} from '@lingui/macro'
import {
  AppBskyEmbedImages,
  AppBskyEmbedRecord,
  AppBskyEmbedRecordWithMedia,
  AppBskyFeedPost,
} from '@atproto/api'
import {ComposerOptsPostRef} from 'state/shell/composer'
import {usePalette} from 'lib/hooks/usePalette'
import {sanitizeDisplayName} from 'lib/strings/display-names'
import {sanitizeHandle} from 'lib/strings/handles'
import {UserAvatar} from 'view/com/util/UserAvatar'
import {Text} from 'view/com/util/text/Text'
import QuoteEmbed from 'view/com/util/post-embeds/QuoteEmbed'

export function ComposerReplyTo({replyTo}: {replyTo: ComposerOptsPostRef}) {
  const pal = usePalette('default')
  const {_} = useLingui()
  const {embed} = replyTo

  const [showFull, setShowFull] = React.useState(false)

  const onPress = React.useCallback(() => {
    setShowFull(prev => !prev)
    LayoutAnimation.configureNext({
      duration: 350,
      update: {type: 'spring', springDamping: 0.7},
    })
  }, [])

  const quote = React.useMemo(() => {
    if (
      AppBskyEmbedRecord.isView(embed) &&
      AppBskyEmbedRecord.isViewRecord(embed.record) &&
      AppBskyFeedPost.isRecord(embed.record.value)
    ) {
      // Not going to include the images right now
      return {
        author: embed.record.author,
        cid: embed.record.cid,
        uri: embed.record.uri,
        indexedAt: embed.record.indexedAt,
        text: embed.record.value.text,
      }
    } else if (
      AppBskyEmbedRecordWithMedia.isView(embed) &&
      AppBskyEmbedRecord.isViewRecord(embed.record.record) &&
      AppBskyFeedPost.isRecord(embed.record.record.value)
    ) {
      return {
        author: embed.record.record.author,
        cid: embed.record.record.cid,
        uri: embed.record.record.uri,
        indexedAt: embed.record.record.indexedAt,
        text: embed.record.record.value.text,
      }
    }
  }, [embed])

  const images = React.useMemo(() => {
    if (AppBskyEmbedImages.isView(embed)) {
      return embed.images
    } else if (
      AppBskyEmbedRecordWithMedia.isView(embed) &&
      AppBskyEmbedImages.isView(embed.media)
    ) {
      return embed.media.images
    }
  }, [embed])

  return (
    <Pressable
      style={[pal.border, styles.replyToLayout]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={_(
        msg`Expand or collapse the full post you are replying to`,
      )}
      accessibilityHint={_(
        msg`Expand or collapse the full post you are replying to`,
      )}>
      <UserAvatar avatar={replyTo.author.avatar} size={50} />
      <View style={styles.replyToPost}>
        <Text type="xl-medium" style={[pal.text]}>
          {sanitizeDisplayName(
            replyTo.author.displayName || sanitizeHandle(replyTo.author.handle),
          )}
        </Text>
        <View style={styles.replyToBody}>
          <View style={styles.replyToText}>
            <Text
              type="post-text"
              style={pal.text}
              numberOfLines={!showFull ? 6 : undefined}>
              {replyTo.text}
            </Text>
          </View>
          {images && (
            <ComposerReplyToImages images={images} showFull={showFull} />
          )}
        </View>
        {showFull && quote && <QuoteEmbed quote={quote} />}
      </View>
    </Pressable>
  )
}

function ComposerReplyToImages({
  images,
}: {
  images: AppBskyEmbedImages.ViewImage[]
  showFull: boolean
}) {
  return (
    <View
      style={{
        width: 65,
        flexDirection: 'column',
        alignItems: 'center',
      }}>
      <View style={styles.imagesContainer}>
        {(images.length === 1 && (
          <Image
            source={{uri: images[0].thumb}}
            style={styles.singleImage}
            cachePolicy="memory-disk"
            accessibilityIgnoresInvertColors
          />
        )) ||
          (images.length === 2 && (
            <View style={[styles.imagesInner, styles.imagesRow]}>
              <Image
                source={{uri: images[0].thumb}}
                style={styles.doubleImageTall}
                cachePolicy="memory-disk"
                accessibilityIgnoresInvertColors
              />
              <Image
                source={{uri: images[1].thumb}}
                style={styles.doubleImageTall}
                cachePolicy="memory-disk"
                accessibilityIgnoresInvertColors
              />
            </View>
          )) ||
          (images.length === 3 && (
            <View style={[styles.imagesInner, styles.imagesRow]}>
              <Image
                source={{uri: images[0].thumb}}
                style={styles.doubleImageTall}
                cachePolicy="memory-disk"
                accessibilityIgnoresInvertColors
              />
              <View style={styles.imagesInner}>
                <Image
                  source={{uri: images[1].thumb}}
                  style={styles.doubleImage}
                  cachePolicy="memory-disk"
                  accessibilityIgnoresInvertColors
                />
                <Image
                  source={{uri: images[2].thumb}}
                  style={styles.doubleImage}
                  cachePolicy="memory-disk"
                  accessibilityIgnoresInvertColors
                />
              </View>
            </View>
          )) ||
          (images.length === 4 && (
            <View style={styles.imagesInner}>
              <View style={[styles.imagesInner, styles.imagesRow]}>
                <Image
                  source={{uri: images[0].thumb}}
                  style={styles.doubleImage}
                  cachePolicy="memory-disk"
                  accessibilityIgnoresInvertColors
                />
                <Image
                  source={{uri: images[1].thumb}}
                  style={styles.doubleImage}
                  cachePolicy="memory-disk"
                  accessibilityIgnoresInvertColors
                />
              </View>
              <View style={[styles.imagesInner, styles.imagesRow]}>
                <Image
                  source={{uri: images[2].thumb}}
                  style={styles.doubleImage}
                  cachePolicy="memory-disk"
                  accessibilityIgnoresInvertColors
                />
                <Image
                  source={{uri: images[3].thumb}}
                  style={styles.doubleImage}
                  cachePolicy="memory-disk"
                  accessibilityIgnoresInvertColors
                />
              </View>
            </View>
          ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  replyToLayout: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: 16,
    paddingBottom: 16,
  },
  replyToPost: {
    flex: 1,
    paddingLeft: 13,
    paddingRight: 8,
  },
  replyToBody: {
    flexDirection: 'row',
    gap: 10,
  },
  replyToText: {
    flex: 1,
    flexGrow: 1,
  },
  imagesContainer: {
    borderRadius: 6,
    overflow: 'hidden',
    marginTop: 2,
  },
  imagesInner: {
    gap: 2,
  },
  imagesRow: {
    flexDirection: 'row',
  },
  singleImage: {
    width: 65,
    height: 65,
  },
  doubleImageTall: {
    width: 32.5,
    height: 65,
  },
  doubleImage: {
    width: 32.5,
    height: 32.5,
  },
})
