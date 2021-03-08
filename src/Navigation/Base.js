import React, { useEffect } from 'react';
import {connect} from 'react-redux';

import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';

import SplashScreen from '../Screens/Splash/SplashScreen';
import GuideScreen from '../Screens/Guide/GuideScreen';
import LoginStackNavigator from './LoginStackNavigator';
import MainTabNavigator from './MainTabNavigator';

import {
    setLoading,
    setGuide,
    loginByToken
} from '../Redux/action/globalAction'
import FALoading from '../Components/FALoading';
import FAAlert from '../Components/Alerts/FAAlert';
import {setClientToken} from '../Config/APIKit';

const Base = (props) => {
    const {loading, setLoading, loginByToken, setGuide, guide, loggedin} = props

    useEffect(() => {
        bootstrapAsync();
    }, [])

    const bootstrapAsync = async () => {
        const guidePassed = await AsyncStorage.getItem('guide_passed')
        if(guidePassed === 'true') {
            setGuide(false)
        }

        const token = await AsyncStorage.getItem('token')
        if(token && token.length > 0) {
            setClientToken(token)
            loginByToken()
        }

        setTimeout(() => {
            setLoading(false)
        }, 2000)
    }
    
    return loading === true ?
        <SplashScreen/>
    : guide === true 
        ? <GuideScreen/>
        : 
            <NavigationContainer>
                { loggedin ? 
                    <MainTabNavigator/>
                :   
                    <LoginStackNavigator/>
                }
                <FALoading/>
                <FAAlert/>
            </NavigationContainer>
}

const mapStateToProps = state => {
    return ({
        loading: state.global.loading,
        guide: state.global.guide,
        loggedin: state.global.loggedin,
    })
}

const mapDispatchToProps = {
    setLoading,
    setGuide,
    loginByToken
}

export default connect(
    mapStateToProps, 
    mapDispatchToProps
)(Base);