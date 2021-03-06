import React, { Component, PropTypes } from 'react';
import { 
  NavigationExperimental,
  Text,
  ScrollView,
  PixelRatio,
  StyleSheet,
  View,
  BackAndroid
} from 'react-native';

import Scene from './Scene';
import Home from './Home';
import Users from './Users';
import Products from './Products';

const {
  CardStack: NavigationCardStack,
  StateUtils: NavigationStateUtils,
} = NavigationExperimental;

function createReducer(initialState) {
  return (currentState = initialState, action) => {
    switch (action.type) {
      case 'push':
        return NavigationStateUtils.push(currentState, {key: action.key});
      case 'pop':
        return currentState.index > 0 ?
          NavigationStateUtils.pop(currentState) :
            currentState;
          default:
            return currentState;
      }
   }
}

const NavReducer = createReducer({
  index: 0,
  key: 'App',
  routes: [{key: 'Home'}]
})

class MainApplication extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      navState: NavReducer(undefined, {})
    }
  }

  componentDidMount () {
    BackAndroid.addEventListener('hardwareBackPress',
      this._handleBackAction.bind(this));
  }
  componentWillUnmount () {
    BackAndroid.removeEventListener('hardwareBackPress',
      this._handleBackAction.bind(this));
  }

  _handleAction (action) {
    const newState = NavReducer(this.state.navState, action);
    if (newState === this.state.navState) {
      return false;
    }
    this.setState({
      navState: newState
    })
    return true;
 }

  _handleBackAction() {
   return this._handleAction({ type: 'pop' });
 }     

  render() {
    return (
      <NavigationCardStack
        navigationState={this.state.navState}
        onNavigate={this._handleAction.bind(this)}
        renderScene={this._renderScene.bind(this)} />
    )
  }

  _renderRoute(key) {
    switch (key) {
      case 'Products':
        return (
          <View>
            <Scene
              onPushRoute={this._handleAction.bind(this,
              { type: 'push', key: 'Users' })}
              onPopRoute={this._handleBackAction.bind(this)}
              onExit={this.props.onExit}
              name={'Products'}
            />
            <Products />
          </View>
        )
      case 'Users':
        return (
          <View>
            <Scene
              onPopRoute={this._handleBackAction.bind(this)}
              onExit={this.props.onExit}
              name={'Users'}
            />
            <Users />
          </View>
        )
      default:
        return (
          <View style={styles.wrapper}>
            <Scene
              onPushRoute={this._handleAction.bind(this,
              { type: 'push', key: 'Products' })}
              name={'Home'}
              onExit={this.props.onExit}
            />
            <Home style={styles.wrapper}/>
          </View>
        )
    }
  }

  _renderScene(sceneProps) {
    const ComponentToRender = this._renderRoute(sceneProps.scene.route.key, sceneProps)

    return (
      <ScrollView style={styles.scrollView}>
        {ComponentToRender}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1
  },
  wrapper: {
    flex: 1
  }
});

export default MainApplication;
