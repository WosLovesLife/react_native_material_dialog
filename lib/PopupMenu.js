import React, { PureComponent } from 'react';
// UI Elements
import { StyleSheet, Animated, Modal, View, TouchableWithoutFeedback } from 'react-native';

/**
 * static propTypes = {
    style: PropTypesHelper.style,
    onEmotionPress: PropTypesHelper.func,
  };
 */
export default class PopupMenu extends PureComponent {
  _animValue = new Animated.Value(0);

  constructor(props) {
    super(props);
    this.state = { visible: false, offsetX: 0, offsetY: 0 };
  }

  showByAnchor = (anchor) => {
    anchor.measure((fx, fy, width, height, px, py) => {
      this.show(
        px,
        py,
      );
    });
  }

  show = (offsetX, offsetY) => {
    if (this._animValue._value == 1) {
      return;
    }
    this.setState({ visible: true, offsetX, offsetY });

    Animated.timing(this._animValue, {
      duration: 180,
      toValue: 1,
    }).start();
  };

  dismiss = () => {
    if (this._animValue._value == 0) {
      return;
    }
    Animated.timing(this._animValue, {
      duration: 180,
      toValue: 0,
    }).start(({ finished }) => {
      this.setState({ visible: false });
    });
  };

  isShown = () => {
    return this.state.visible;
  };

  render() {
    const { style, children } = this.props;
    const { offsetX, offsetY } = this.state;

    return (
      <Modal onRequestClose={() => { }} animationType={'none'} transparent={true} visible={this.isShown()}>
        <TouchableWithoutFeedback
          onPress={() => {
            this.dismiss();
          }}>
          <View style={{ flex: 1 }} />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[
            styles.container,
            {
              left: offsetX,
              top: offsetY,
              transform: [
                { scale: this._animValue },
                {
                  translateX: this._animValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-200, 0],
                  }),
                },
              ],
              opacity: this._animValue,
            },
            style,
          ]}>
          {children}
        </Animated.View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    paddingLeft: 12,
    paddingRight: 12,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 4,
    shadowOffset: { width: 0, height: 3 },
    shadowColor: 'grey',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
});
