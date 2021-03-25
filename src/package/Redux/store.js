import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import thunk from 'redux-thunk';

import smartcrudReducer from './reducer';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(combineReducers({
    smartcrud: smartcrudReducer,

}), composeEnhancers(
    applyMiddleware(thunk)
));

export default store;


