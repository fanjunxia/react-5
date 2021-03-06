import React, { Component, PropTypes } from 'react';
import pureRender from 'pure-render-decorator';
import classnames from 'classnames';
import * as types from '../../constants/actions/cart';
/*ant*/
import {Modal,Toast} from 'antd-mobile';
import './Footer.scss';
@pureRender
class Header extends Component {

	constructor(props, context) {
		super(props, context);
		this.handleBuy = this.handleBuy.bind(this);

		this.handleSelect = this.handleSelect.bind(this); // 选择事件
		this.handleDelete = this.handleDelete.bind(this); // 删除
	}
	handleBuy(event){
		let {carts}=this.props;
		if(carts.length==0){
			Toast.info('至少购买1件');
		}else{
			let url = types.CART_MAIN_POST;
			let param = {
				id:carts
			};

			let params = {
				param: param,
				ajaxType: 'POST',
				onSuccess: (res) => {
					Toast.hide();
					_global.history.push('/order');
				},
				onError: (res) => {
					Toast.hide();
				}
			};
			Toast.loading(null, 0);
			this.props.actions.request(url, params);
		}
	}
	handleSelect(event){
		this.props.actions.cartSelect(null);
	}
	handleDelete(){
		const {carts} = this.props;
		let url = types.CART_MAIN_DELETE;
		let param = {
			id:carts
		};
		let params = {
			param: param,
			ajaxType: 'DELETE',
			onSuccess: (res) => {
				Toast.hide();
			},
			onError: (res) => {
				Toast.hide();
			}
		};
		if(param.id instanceof Array &&param.id.length==0){
			Toast.info('至少删除1件');
			return !1;
		}
		Modal.alert('删除', '确定删除么?', [
		   { text: '取消'},
		   { text: '确定', onPress: () => {
				Toast.loading(null, 0);
		   		this.props.actions.request(url, params);
		   }}
	 	]);
	}
	render() {
		const {edit,carts,carts_temp,_quantity,_price,onSelect,onDelete} = this.props;
		/*carts 与 carts_temp比较 判断是否全选*/
		const icon = carts.sort().toString() == carts_temp.sort().toString();
		let editHtml;
		if (edit) {
			editHtml = (
				<div>
					<div className="w-col-4 w-tr">
						<div>合计:<b>￥<em>{_price}</em></b></div>
						<small>不含运费</small>
					</div>
					<div className="w-col-3 w-tc" onClick = {this.handleBuy}>
						结算
						(<em>{_quantity}</em>)
					</div>
				</div>
			);

		} else {
			editHtml = (
				<div className="w-col-3 w-col-ml-4 w-tc" onClick = {this.handleDelete} >删除</div>
			);
		}

		return (
			<div className="cart-footer w-bg-white w-media-fixed">
				<div className="w-col-5">
					<i 	
						className={
							classnames(
								"iconfont w-tc icon-select",
								{'w-green':icon}
							)
						} 
						onClick = {this.handleSelect}
					/>
					全选
				</div>
				{editHtml}
			</div>
		);
	}
}
Header.propTypes = {
	edit:React.PropTypes.bool,
	actions:React.PropTypes.object,
	carts:React.PropTypes.array,
	carts_temp:React.PropTypes.array,
	_quantity:React.PropTypes.number,
	_price:React.PropTypes.string
};
export default Header;