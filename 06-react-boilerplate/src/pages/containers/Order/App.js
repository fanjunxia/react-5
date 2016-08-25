import React, { Component, PropTypes } from 'react';
import {
	bindActionCreators
} from 'redux';
import {
	connect
} from 'react-redux';
import * as OrderActions from '../../actions/order';
import Order from './Modules/Order';
class App extends Component {
	constructor(props,context) {
	    super(props,context);
	}
  	render() {//做路由判断，返回不同组件
    	let { ...rest } = this.props;
      	return (<Order {...rest} />);
  	}
}

function mapStateToProps(state) {
	return {
		order: state.order
	};
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(OrderActions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(App);