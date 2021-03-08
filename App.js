/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { Provider } from 'react-redux';
// import admob, {MaxAdContentRating} from '@react-native-firebase/admob'
import Base from './src/Navigation/Base';
import Store from './src/Redux/store';


// admob().setRequestConfiguration({
//   maxAdContentRating: MaxAdContentRating.T,
//   tagForChildDirectedTreatment: false,
//   tagForUnderAgeOfConsent: false
// })

// const {store, persistor} = Store()
const App = () => {
    console.log("*************************** App refreshed *****************************")
    return (
    <Provider store={Store.store}>
      <Base/>
    </Provider>
  );
}

export default App;