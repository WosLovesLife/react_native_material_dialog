import React, { PureComponent } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';

export type DialogMenuItem = {
  text: number | string,
  onPress: Function,
};

/**
 * static propTypes = {
    items: array,
  };
 */
export default class MenuItems extends PureComponent {
  constructor(props) {
    super(props);

    this.state = this._generateState(props);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(this._generateState(nextProps));
  }

  _generateState = props => {
    return {
      items: props.items,
      onItemPress: props.onItemPress,
    };
  };

  _renderItem = (item, index) => {
    const { text, onPress } = item;
    return (
      <TouchableOpacity key={text + index} style={styles.itemContainer} onPress={onPress}>
        <Text style={styles.itemText}>{text}</Text>
      </TouchableOpacity>
    );
  };

  render() {
    const { items } = this.props;

    var i = 0;
    let itemViews = items.map(item => {
      return this._renderItem(item, i++);
    });

    return <View>{itemViews}</View>;
  }
}

/* ------------- Styles ------------- */

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    height: 48,
    alignItems: 'center',
    paddingLeft: 24,
    paddingRight: 24,
  },
  itemText: {
    color: '#002b3b',
    fontSize: 14,
  },
});
