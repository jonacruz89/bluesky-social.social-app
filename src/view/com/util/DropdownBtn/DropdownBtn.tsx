import React, {useRef} from 'react'
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native'
import {IconProp} from '@fortawesome/fontawesome-svg-core'
import RootSiblings from 'react-native-root-siblings'
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome'
import {colors} from '../../../lib/styles'

const HITSLOP = {left: 10, top: 10, right: 10, bottom: 10}

export interface DropdownItem {
  icon?: IconProp
  label: string
  onPress: () => void
}

export default function DropdownBtn({
  style,
  items,
  menuWidth,
  children,
}: {
  style?: StyleProp<ViewStyle>
  items: DropdownItem[]
  menuWidth?: number
  children?: React.ReactNode
}) {
  const ref = useRef<TouchableOpacity>(null)

  const onPress = () => {
    ref.current?.measure(
      (
        _x: number,
        _y: number,
        width: number,
        height: number,
        pageX: number,
        pageY: number,
      ) => {
        if (!menuWidth) {
          menuWidth = 200
        }
        createDropdownMenu(
          pageX + width - menuWidth,
          pageY + height,
          menuWidth,
          items,
        )
      },
    )
  }

  return (
    <TouchableOpacity
      style={style}
      onPress={onPress}
      hitSlop={HITSLOP}
      ref={ref}>
      {children}
    </TouchableOpacity>
  )
}

function createDropdownMenu(
  x: number,
  y: number,
  width: number,
  items: DropdownItem[],
): RootSiblings {
  const onPressItem = (index: number) => {
    sibling.destroy()
    items[index].onPress()
  }
  const onOuterPress = () => sibling.destroy()
  const sibling = new RootSiblings(
    (
      <>
        <TouchableWithoutFeedback onPress={onOuterPress}>
          <View style={styles.bg} />
        </TouchableWithoutFeedback>
        <View style={[styles.menu, {left: x, top: y, width}]}>
          {items.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.menuItem]}
              onPress={() => onPressItem(index)}>
              {item.icon && (
                <FontAwesomeIcon style={styles.icon} icon={item.icon} />
              )}
              <Text style={styles.label}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </>
    ),
  )
  return sibling
}

const styles = StyleSheet.create({
  bg: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: '#000',
    opacity: 0.1,
  },
  menu: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderRadius: 14,
    opacity: 1,
    paddingVertical: 6,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingLeft: 15,
    paddingRight: 40,
  },
  menuItemBorder: {
    borderTopWidth: 1,
    borderTopColor: colors.gray1,
    marginTop: 4,
    paddingTop: 12,
  },
  icon: {
    marginLeft: 6,
    marginRight: 8,
  },
  label: {
    fontSize: 18,
  },
})