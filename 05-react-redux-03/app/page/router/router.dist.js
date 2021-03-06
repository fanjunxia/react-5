import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import configureStore from '../stores/configureStore';
import { initialState } from '../stores/stores'; //存储数据初始化数据
import App from '../containers/App';
import Test from '../containers/Test';
import Counter from '../containers/Counter';
import Todos from '../containers/Todos';
import Async from '../containers/Async';
import List from '../containers/List';
import Comment from '../containers/Comment';
import Detail from '../containers/Detail';
import { syncHistoryWithStore } from 'react-router-redux';
import { Router, IndexRoute, Route, browserHistory, useRouterHistory, hashHistory} from 'react-router';
import '../../css/normalize.css';
let store = configureStore(); //可以从../stores/stores.js传入initialState
const history = syncHistoryWithStore(hashHistory, store);
//本来router的state没在redux中管理，你用了这个，那么，router的state也会在redux中；很好使


export default class Root extends Component {

    constructor(props, context) {
        super(props, context);
    }
    render() {
        return (
            <Provider store={store}>
                <div>
                    <Router history={history}>
                        <Route path="/" component={App}>
                            <Route path="/test" component={Test}/>
                            <Route path="/counter" component={Counter}/>
                            <Route path="/todomvc" component={Todos}/>
                            <Route path="/async" component={Async}/>
                            <Route path="/tabslist" component={List}/>
                            <Route path="/comment/:id" component={Comment}/>
                            <Route path="/detail/:id/:commentid" component={Detail}/>
                        </Route>
                    </Router>
                </div>
            </Provider>
        );
    }
}
render(
    <Root />,
    document.getElementById('pages')
);


