import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import LoginStartScreen from '../Screens/Login/LoginStartScreen';
import LoginMainScreen from '../Screens/Login/LoginMainScreen';
import SocialAgreeScreen from '../Screens/Login/SocialAgreeScreen';
import LoginEmailScreen from '../Screens/Login/LoginEmailScreen';
import RegisterScreen from '../Screens/Login/RegisterScreen';
import ForgotPasswordScreen from '../Screens/Login/ForgotPasswordScreen';

const Stack = createStackNavigator();

const LoginStackNavigator = ({navigation}) => {
    return (
        <Stack.Navigator
            initialRouteName="LoginStartScreen"
            headerMode='none'
        >
            <Stack.Screen
                name = "LoginStartScreen"
                component = {LoginStartScreen}
            />
            <Stack.Screen
                name = "LoginMainScreen"
                component = {LoginMainScreen}
            />
            <Stack.Screen
                name = "SocialAgreeScreen"
                component = {SocialAgreeScreen}
            />
            <Stack.Screen
                name = "LoginEmailScreen"
                component = {LoginEmailScreen}
            />
            <Stack.Screen
                name = "RegisterScreen"
                component = {RegisterScreen}
            />
            <Stack.Screen
                name = "ForgotPasswordScreen"
                component = {ForgotPasswordScreen}
            />
        </Stack.Navigator>
    )
}

export default LoginStackNavigator