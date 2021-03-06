import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import net from 'net';
import { getItem, setItem ,delItem } from 'utils';
import { Toast , Modal } from 'antd-mobile';
import API_ROOT from 'apiRoot';

import './Payment.scss';

let Dom = document.body;
let PaymentStatics = {};
PaymentStatics = {
    payment(options){
        //return new Promise((resolve, reject) => {
            const div = document.createElement('div');
            Dom.appendChild(div);
            options = {
                ...options,
                show: true,
                onCloseSoon: () => {
                    ReactDOM.unmountComponentAtNode(div); //卸载组件
                    Dom.removeChild(div); //Dom可以写成div.parentNode感觉更加合理些
                    delete _global.APIS.payment;
                },
                onSure: (res) => {//成功回调
                    options.onCloseSoon();
                    //resolve(res);
                },
                onClose: () => {//失败回调
                    options.onCloseSoon();
                    //reject();
                }
            };
            /*异步请求数据，不放入redux*/
            let param = {
                ...options.req
            };
            let localData = null;
            if(options.req.action!='getPaymentInfo'){
                localData = {//模拟本地数据
                    status:1,
                    data:{
                        amount:options.req.amount,
                        pay:[options.req.type]
                    }
                };
            }
            Toast.loading(null, 0);
            net.ajax({
                url: API_ROOT['_PAYMENT_MAIN_GET'],
                type: 'GET', //暂时先get方法
                param,
                localData,
                success: (res) => {
                    Toast.hide();
                    _global.APIS.payment = div; //路由变化清理页面
                    options = {...options,data:res.data};
                    return ReactDOM.render(<Payment {...options} />, div);
                },
                error: (res) => {
                    //reject();
                    return !1;
                }
            });
        //});
    },
    popup(options){
        if (typeof options !== 'object') {
            return console.error('options is not object');
        }
        return PaymentStatics.payment(options);
    }
};
class Payment extends React.Component {
    static popup = PaymentStatics.popup; //API：形式创建节点；Component：不使用则可以使用组件方式

    constructor(props,context) {
        super(props);
        this.state = {
            payType:"wxpay"
        };
        this.handleClose = this.handleClose.bind(this);
        this.handlePayType = this.handlePayType.bind(this);
        this.handlePay = this.handlePay.bind(this);
    }
    componentWillMount(){
    }
    componentWillUnmount () {
        console.info('卸载组件');
    }
    handlePayType(event){
        const $this = event.target;
        const type = $this.getAttribute('data-type');
        this.setState({
            payType:type
        });
    }
    handleClose(event) {
        event.preventDefault();
        Modal.alert('删除', '确定要离开么?', [
           { text: '取消'},
           { text: '确定', onPress: () => {
                if(this.props.req.action!='getPaymentInfo'){
                    this.props.onClose && this.props.onClose();
                }else{//到用户端的支付页面
                    _global.history.push('/order?pages=list&&type=topay');
                }
           }}
        ]);
    }
    handlePay(){//支付
        let param = {
            order_id:this.props.data.order_id,
            payway:this.state.payType
        };
        Toast.loading(null, 0);
        net.ajax({
            url: API_ROOT['_PAYMENT_MAIN_POST'],
            type: 'POST', 
            param,
            success: (res) => {
                Toast.hide();
                if(this.props.req.action=='agent'){
                    _global.history.push('/agent-purchase/amount');
                }else{
                    _global.history.push('/order?pages=list&&type=all');
                }
            },
            error: (res) => {
                Toast.hide();
                return !1;
            }
        });
    }
    render() {
        const {show,data} = this.props;
        console.log(this.props);
        const {
            pay
        } = data;
        if (!show) {
            return null;
        }

        return (
            <div className="w-reset">
                <div className="w-bg-fixed w-close" onClick={this.handleClose}></div>
                <div className="w-bg-white w-fixed w-row">
                    <p className="w-close-position">确认付款<i className="iconfont icon-close" /></p>
                    <p className="w-pd-lr w-tc">还需要支付<b className="w-orange">￥11.22</b></p>
                    <ul className="w-payment">
                    {
                        pay.map((item,index)=>{
                            return(
                                <li 
                                    key={item} 
                                    className={
                                        classnames('w-'+item,{'pay-checked':item==this.state.payType})
                                    }
                                    onClick = {this.handlePayType}
                                    data-type={item}
                                >
                                {(()=>{
                                    switch(item) {
                                        case 'wxpay':
                                            return '微信支付';
                                        case 'alipay':
                                            return '支付宝支付';
                                        case 'income':
                                            return '余额（收益）支付';
                                        default:
                                            return null;
                                    }
                                })()}
                                </li>
                            );
                              
                        })
                    }
                    </ul>
                    <div className="w-bg-pink w-lh-80 w-tc" onClick = {this.handlePay}>确认付款</div>
                </div>
            </div>
        );
    }
}

Payment.propTypes = {
    req:React.PropTypes.shape({
        action:React.PropTypes.string,
        aid:React.PropTypes.string,
        lid:React.PropTypes.string,
    }),
    show:React.PropTypes.bool,
    onClose:React.PropTypes.func,
    onSure:React.PropTypes.func,
    data:React.PropTypes.object
};

export default Payment;