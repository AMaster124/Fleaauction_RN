import React, {useEffect} from 'react';
import {Image, Platform, Text} from 'react-native'
import {createAppContainer} from 'react-navigation';
import { createStackNavigator } from "react-navigation-stack";
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {connect} from 'react-redux';

import HomeScreen from '../Screens/Home/HomeScreen';
import HomeSearchScreen from '../Screens/Home/HomeSearchScreen';
import LiveAuctionScreen from '../Screens/Home/LiveAuctionScreen';
import MultiAuctionScreen from '../Screens/Home/MultiAuctionScreen';
import AuctionResultScreen from '../Screens/Home/AuctionResultScreen';
import WinBidPayScreen from '../Screens/Home/WinBidPayScreen';

import AuctionScreen from '../Screens/Auction/AuctionScreen';

import DonationScreen from '../Screens/Donation/DonationScreen';
import CampaignDetailScreen from '../Screens/Donation/CampaignDetailScreen';

import ProfileScreen from '../Screens/Profile/ProfileScreen';
import ProfileEditScreen from '../Screens/Profile/ProfileEditScreen';
import SettingScreen from '../Screens/Profile/SettingScreen';
import DonationHistoryScreen from '../Screens/Profile/DonationHistoryScreen';
import RewardScreen from '../Screens/Profile/RewardScreen';
import BidHistoryScreen from '../Screens/Profile/BidHistoryScreen';
import FavoriteListScreen from '../Screens/Profile/FavoriteListScreen';
import DaumPostCodeScreen from '../Screens/Profile/DaumPostCodeScreen';

const activeTintColor = '#1e1e1e';
const inactiveTintColor = '#909090';

const HomeStack = createStackNavigator(
    {
        HomeScreen: { screen: HomeScreen},
        HomeSearchScreen: { screen: HomeSearchScreen, params: {tabBarVisible: false}},
        LiveAuctionScreen: { screen: LiveAuctionScreen},
        MultiAuctionScreen: { screen: MultiAuctionScreen},
        AuctionResultScreen: { screen: AuctionResultScreen, params: {tabBarVisible: false} },
        WinBidPayScreen: { screen: WinBidPayScreen, params: {tabBarVisible: false} },
        CampaignDetailScreen: { screen: CampaignDetailScreen},
        DaumPostCodeScreen: { screen: DaumPostCodeScreen, params: {tabBarVisible: false} },
    },
    {
        headerMode: 'none',
    }
)

const AuctionStack = createStackNavigator(
    {
        AuctionScreen: AuctionScreen,
        // FreetalkListScreen: {screen: FreetalkListScreen, params: {tabBarVisible: false}},
    },
    {
        headerMode: 'none'
    }
)

const DonationStack = createStackNavigator(
    {
        DonationScreen: DonationScreen,
        CampaignDetailScreen: { screen: CampaignDetailScreen, params: {tabBarVisible: false} },
        LiveAuctionScreen: { screen: LiveAuctionScreen},
        MultiAuctionScreen: { screen: MultiAuctionScreen},
    },
    {
        headerMode: 'none'
    }
)

const ProfileStack = createStackNavigator(
    {
        ProfileScreen: ProfileScreen,
        ProfileEditScreen: { screen: ProfileEditScreen, params: {tabBarVisible: false} },
        SettingScreen: { screen: SettingScreen, params: {tabBarVisible: false} },
        DonationHistoryScreen: { screen: DonationHistoryScreen, params: {tabBarVisible: false} },
        RewardScreen: { screen: RewardScreen, params: {tabBarVisible: false} },
        BidHistoryScreen: { screen: BidHistoryScreen, params: {tabBarVisible: false} },
        FavoriteListScreen: { screen: FavoriteListScreen, params: {tabBarVisible: false} },
        LiveAuctionScreen: { screen: LiveAuctionScreen},
        MultiAuctionScreen: { screen: MultiAuctionScreen},
        AuctionResultScreen: { screen: AuctionResultScreen, params: {tabBarVisible: false} },
        WinBidPayScreen: { screen: WinBidPayScreen, params: {tabBarVisible: false} },
        DaumPostCodeScreen: { screen: DaumPostCodeScreen, params: {tabBarVisible: false} },
    },
    {
        headerMode: 'none'
    }
)

const AppNav = (props) => {
    useEffect(() => {
    }, [])
    
    const Container = createAppContainer(createBottomTabNavigator(
        {
            Home: {
                screen: HomeStack,
                navigationOptions: ({navigation}) => {
                    let tabBarVisible = true
                    const {params = {}} = navigation.state.routes[navigation.state.index];
                    tabBarVisible = params.tabBarVisible === false ? params.tabBarVisible : true;
    
                    return {
                        tabBarLabel: '홈',
                        tabBarIcon: ({tintColor}) => {
                            return (
                                <Image
                                    source={tintColor === activeTintColor ? require('../Assets/ic_home_pressed.png') : require('../Assets/ic_home_normal.png')}
                                    width={24}
                                    height={24}
                                    resizeMode={'stretch'}
                                    style={{width: 24, height: 24}}
                                />
                            );
                        },
                        tabBarVisible: tabBarVisible,
                        initialRouteName: 'HomeScreen',
                    }
                },
            },
            Auction: {
                screen: AuctionStack,
                navigationOptions: ({navigation}) => {
                    let tabBarVisible = true
                    const {params = {}} = navigation.state.routes[navigation.state.index];
                    tabBarVisible = params.tabBarVisible === false ? params.tabBarVisible : true;
    
                    return {
                        tabBarLabel: '옥션하자',
                        tabBarIcon: ({tintColor}) => {
                            return (
                                <Image
                                    source={tintColor === activeTintColor ? require('../Assets/ic_auction_pressed.png') : require('../Assets/ic_auction_normal.png')}
                                    width={24}
                                    height={24}
                                    resizeMode={'stretch'}
                                    style={{width: 24, height: 24}}
                                />
                            );
                        },
                        tabBarVisible: tabBarVisible,
                        initialRouteName: 'AuctionScreen',
                    }
                },
            },
            Donation: {
                screen: DonationStack,
                navigationOptions: ({navigation}) => {
                    let tabBarVisible = true
                    const {params = {}} = navigation.state.routes[navigation.state.index];
                    tabBarVisible = params.tabBarVisible === false ? params.tabBarVisible : true;
    
                    return {
                        tabBarLabel: '기부하자',
                        tabBarIcon: ({tintColor}) => {
                            return (
                                <Image
                                    source={tintColor === activeTintColor ? require('../Assets/ic_donate_pressed.png') : require('../Assets/ic_donate_normal.png')}
                                    width={24}
                                    height={24}
                                    resizeMode={'stretch'}
                                    style={{width: 24, height: 24}}
                                />
                            );
                        },
                        tabBarVisible: tabBarVisible,
                        initialRouteName: 'DonationScreen',
                    }
                },
            },
            Profile: {
                screen: ProfileStack,
                navigationOptions: ({navigation}) => {
                    let tabBarVisible = true
                    const {params = {}} = navigation.state.routes[navigation.state.index];
                    tabBarVisible = params.tabBarVisible === false ? params.tabBarVisible : true;
    
                    return {
                        tabBarLabel: '마이 프로필',
                        tabBarIcon: ({tintColor}) => {
                            return (
                                <Image
                                    source={tintColor === activeTintColor ? require('../Assets/ic_profile_pressed.png') : require('../Assets/ic_profile_normal.png')}
                                    width={24}
                                    height={24}
                                    resizeMode={'stretch'}
                                    style={{width: 24, height: 24}}
                                />
                            );
                        },
                        tabBarVisible: tabBarVisible,
                        initialRouteName: 'ProfileScreen',
                        // tabBarOnPress: ({navigation, defaultHandler}) => {
                        //     if( loggedin ) {
                        //         defaultHandler()
                        //     } else {
                        //         showAlert({message: Lang.rediret_to_login, isConfirm: true, confirmAction: () => {
                        //             setShowLogin(true)
                        //         }})
                        //     }
                        // }
                    }
                },
            }
        },
        {
            animationEnabled: true,
            swipeEnabled: true,
            tabBarOptions: {
                pressColor: 'black',
                style: {
                    backgroundColor: '#ececec',
                    paddingBottom: 7,
                    paddingTop: 7,
                    height: 60
                },
                indicatorStyle: {
                    backgroundColor: 'black',
                },
                activeTintColor: activeTintColor,
                inactiveTintColor: inactiveTintColor,
                showLabel: true,
                showIcon: true,
                keyboardHidesTabBar: Platform.OS === 'android'
            },
        }
    ))

    return <Container/>
}

const mapStateToProps = state => {
    return {

    }
}

const mapDispatchToProps = {

}

export default connect(
    mapStateToProps, 
    mapDispatchToProps
)(AppNav);
