import React, { Component, PropTypes } from 'react';
import pureRender from 'pure-render-decorator';
import LogisPopup from '../_common/Logis/Logis_Popup';
@pureRender
class GoodsItem extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			show:false
		};
		this.handleShow = this.handleShow.bind(this);
	}
	handleShow(){
		this.setState({
			show:!this.state.show
		});
	}
	render() {
		let {logis,actions} = this.props;
		let {
			id,
			name,
			price,
		} = logis;
		return (
			<div>
				<div className="order-logis" onClick = {this.handleShow}>
					<div className="logis-open-btn w-row w-pd">
						<div className="w-col-5">配送方式</div>
						<i className="iconfont w-fr icon-right" />
						<div className="w-fr logis-price">{name}<b>￥{price}</b></div>
					</div>
				</div>
				<LogisPopup  show= {this.state.show}
							 onShow = {this.handleShow}
							 selectId = {id}
							 actions = {actions}
				/>
			</div>
		);
				
	}
}
GoodsItem.propTypes = {
	logis:React.PropTypes.object,
	actions:React.PropTypes.object
};
export default GoodsItem;