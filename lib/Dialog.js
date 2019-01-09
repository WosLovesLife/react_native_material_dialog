import React, { PureComponent } from 'react';
import { View, StyleSheet, Modal, BackHandler, Text, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { FbColors } from '../feibo.common.base';

/**
  static propTypes = {
    title: string, // 标题
    message: string, // 文字内容
    positiveButtonText: string, // 确认按钮文字
    onPositiveButtonPress: func, // 确认按钮回调
    negativeButtonText: string, // 取消按钮文字
    onNegativeButtonPress: func, // 取消按钮回调
    visible: bool, // dialog是否可见
    cancelable: bool, // 是否允许点击空白处或按返回键关闭dialog
    onShow: func, // 显示时的回调
    onDismiss: func, // 消失时的回调
    customView: element, // 自定义布局
  };
 */
export default class Dialog extends PureComponent {
  static defaultProps = {
    visible: false,
    cancelable: true,
  };

  constructor(props) {
    super(props);
    this.state = this._generateState(props);
  }

  _onBack = () => {
    if (this.isShown()) {
      this.dismiss();
    }
  };

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this._onBack);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this._onBack);
  }

  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.visible != this.state.visible) {
  //     this.setState(this._generateState(nextProps));
  //   }
  // }

  _generateState = props => {
    return {
      visible: props.visible,
      customView: props.customView,
      title: props.title,
      message: props.message,
      positiveButtonText: props.positiveButtonText,
      onPositiveButtonPress: props.onPositiveButtonPress,
      negativeButtonText: props.negativeButtonText,
      onNegativeButtonPress: props.onNegativeButtonPress,
    };
  };

  show = ({
    title,
    message,
    positiveButtonText,
    onPositiveButtonPress,
    negativeButtonText,
    onNegativeButtonPress,
  }) => {
    const newState = { visible: true };
    newState.title = title || this.state.title;
    newState.message = message || this.state.message;
    newState.positiveButtonText = positiveButtonText || this.state.positiveButtonText;
    newState.onPositiveButtonPress = onPositiveButtonPress || this.state.onPositiveButtonPress;
    newState.negativeButtonText = negativeButtonText || this.state.negativeButtonText;
    newState.onNegativeButtonPress = onNegativeButtonPress || this.state.onNegativeButtonPress;
    this.setState(newState);
  };

  dismiss = () => {
    if (this.state.visible) {
      this.setState({ visible: false });
      this.props.onDismiss && this.props.onDismiss();
    }
  };

  isShown = () => {
    return this.state.visible;
  };

  setCustomView = customView => {
    this.setState({ customView: customView });
  };

  _Title = () => {
    const { title } = this.state;
    if (!title) {
      return null;
    }
    return <Text style={styles.title}>{title}</Text>;
  };

  _Content = () => {
    const { message } = this.state;
    const { customView } = this.state;

    if (customView) {
      return customView;
    }

    if (message) {
      return <Text style={styles.message}>{message}</Text>;
    }

    return null;
  };

  _PositiveButton = () => {
    const { positiveButtonText, onPositiveButtonPress } = this.state;
    if (!positiveButtonText) {
      return null;
    }
    return (
      <TouchableOpacity onPress={() => {
        onPositiveButtonPress && onPositiveButtonPress();
        this.dismiss();
      }}>
        <Text style={[styles.buttonContainer, styles.buttonText]}>
          {positiveButtonText}
        </Text>
      </TouchableOpacity>
    );
  };

  _NegativeButton = () => {
    const { negativeButtonText, onNegativeButtonPress } = this.state;
    if (!negativeButtonText) {
      return null;
    }
    return (
      <TouchableOpacity onPress={() => {
        onNegativeButtonPress && onNegativeButtonPress();
        this.dismiss();
      }}>
        <Text style={[styles.buttonContainer, styles.buttonText]}>
          {negativeButtonText}
        </Text>
      </TouchableOpacity>
    );
  };

  _ActionButtonBar = () => {
    const negative = this._NegativeButton();
    const positive = this._PositiveButton();

    if (!negative && !positive) {
      return null;
    }

    return (
      <View style={styles.actionButtonBar}>
        {negative}

        {positive}
      </View>
    );
  };

  render() {
    const { onShow, onDismiss, cancelable } = this.props;
    const { visible } = this.state;
    return (
      <Modal animationType="fade" transparent={true} onRequestClose={() => { }} visible={!!visible} onShow={onShow} onDismiss={onDismiss}>
        <TouchableWithoutFeedback onPress={() => this.dismiss()} disabled={!cancelable}>
          <View style={styles.container}>
            <View style={styles.card}>
              <this._Title />

              <this._Content />

              <this._ActionButtonBar />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}

/* ------------- Styles ------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0, 0.3)',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 3,
    marginLeft: 12,
    marginRight: 12,
    marginTop: 48,
    marginBottom: 48,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: '#e7efef',
    shadowOpacity: 0.5,
    shadowRadius: 5,
    alignSelf: 'center',
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#002b3b',
    marginTop: 24,
    marginLeft: 24,
    marginRight: 24,
  },
  message: {
    color: '#002b3b',
    margin: 24,
    minWidth: 280,
  },
  actionButtonBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    margin: 12,
  },
  buttonContainer: {
    minWidth: 48,
    height: 35,
    paddingLeft: 12,
    paddingRight: 12,
    marginLeft: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#5084fa',
  },
});
