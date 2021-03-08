import {combineReducers} from 'redux'
import storage from '@react-native-community/async-storage';

import globalReducer from './globalReducer'
import modalReducer from './modalReducer';
import alertReducer from './alertReducer';

const persistConfig = {
    key: "root",
    storage: storage,
    whitelist: ["global"]
}

const rootReducer = combineReducers({
    global: globalReducer,
    modal: modalReducer,
    alert: alertReducer
});

export default rootReducer;