import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';

import { 
    StyleSheet, 
    View,
    Text,
    Image,
    StatusBar,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { Switch } from 'react-native-switch';
import Ionicons from 'react-native-vector-icons/Ionicons'

import {logout} from '../../Redux/action/globalAction'
import {showAlert} from '../../Redux/action/AlertAction'
import APIKit from '../../Config/APIKit';
import {setApiLoading} from '../../Redux/action/globalAction'

const SettingScreen = (props) => {
    const {navigation, logout, showAlert, setApiLoading} = props

    const [pushNotification, setPushNotification] = useState(false)
    const [pushKakao, setPushKakao] = useState(false)
    const [pushEmail, setPushEmail] = useState(false)
    const [pushEvent, setPushEvent] = useState(false)


    useEffect(() => {
        loadPushSettings()
    }, [])

    const loadPushSettings = () => {
        setApiLoading(true)
        APIKit.post('users/get-push-setting')
        .then( (res) => {
            setApiLoading(false)
            const data = res.data
            if(!data) {
                return
            }

            if(data.status === true) {
                setPushNotification(!!data.results.push_notification)
                setPushKakao(!!data.results.push_kakao)
                setPushEmail(!!data.results.push_email)
                setPushEvent(!!data.results.push_event)
            } else {
                showAlert({message: data.msg[0]})
            }
        })
        .catch(error => {
            setApiLoading(false)
            console.log('users/get-push-setting', error.message)
        })
    }

    const savePushSettings = (callback = null) => {
        setApiLoading(true)
        const payload = {
            push_notification: pushNotification,
            push_kakao: pushKakao,
            push_email: pushEmail,
            push_event: pushEvent
        }

        APIKit.post('users/update-push-setting', payload)
        .then( (res) => {
            setApiLoading(false)
            callback()
        })
        .catch(error => {
            setApiLoading(false)
            console.log('users/update-push-setting', error.message)
        })
    }

    const onPressLogout = () => {
        showAlert({message: '로그아웃 하시겠습니까?', confirmAction: logout})
    }

    const onPressBack = () => {
        savePushSettings(() => {
            navigation.pop()
        })
    }

    return (
        <View style={[styles.container]}>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={{flex: 1}}>
                <View style={styles.header}>
                    <TouchableOpacity 
                        style={styles.header_left}
                        onPress={onPressBack}
                    >
                        <Ionicons
                            size={24}
                            color={'#1e1e1e'}
                            name={'chevron-back'}
                        />
                    </TouchableOpacity>
                    <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 18, color: '#1e1e1e'}}>설정</Text>
                </View>
                <View style={{width: '100%', height: 1, backgroundColor: '#ececec'}}/>
                <ScrollView style={{flex: 1, paddingHorizontal: 16}}>
                    <View style={{paddingVertical: 25}}>
                        <View style={[styles.flex_row, ]}>
                            <Image
                                style={{width: 24, height: 24}}
                                width={24}
                                height={24}
                                source={require('../../Assets/ic_alarm.png')}
                            />
                            <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 15, color: '#1e1e1e', marginLeft: 8, flex: 1, lineHeight: 24}}>PUSH 알림</Text>
                            <Switch
                                value={pushNotification}
                                onValueChange={setPushNotification}
                                activeText={'ON'}
                                inActiveText={'OFF'}
                                backgroundActive={'#04dea0'}
                                backgroundInactive={'#bababa'}
                                circleActiveColor={'#ffffff'}
                                circleInActiveColor={'#ffffff'}
                                circleBorderWidth={0}
                                switchWidthMultiplier={2}
                                renderActiveText={false}
                                renderInActiveText={false}
                                circleSize={28}
                                renderInsideCircle={() => (
                                    <View style={{borderWidth: 4, borderColor: pushNotification === true ? '#04dea0' : '#bababa', width: '100%', height: '100%', borderRadius: 13.5}}/>
                                )}
                            />
                        </View>
                        <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 12, color: '#909090', marginLeft: 32, marginTop: 3, flex: 1, lineHeight: 18}}>
                            {`거래에 관련된 알림이\nPUSH 알림으로 전송됩니다.`}
                        </Text>
                    </View>
                    <View style={{height: 1, backgroundColor: '#f5f5f5'}}/>
                    <View style={{paddingVertical: 25}}>
                        <View style={[styles.flex_row, ]}>
                            <Image
                                style={{width: 24, height: 24}}
                                width={24}
                                height={24}
                                source={require('../../Assets/logo_kakaotalk.png')}
                            />
                            <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 15, color: '#1e1e1e', marginLeft: 8, flex: 1, lineHeight: 24}}>카카오톡 알림</Text>
                            <Switch
                                value={pushKakao}
                                onValueChange={setPushKakao}
                                activeText={'ON'}
                                inActiveText={'OFF'}
                                backgroundActive={'#04dea0'}
                                backgroundInactive={'#bababa'}
                                circleActiveColor={'#ffffff'}
                                circleInActiveColor={'#ffffff'}
                                circleBorderWidth={0}
                                switchWidthMultiplier={2}
                                renderActiveText={false}
                                renderInActiveText={false}
                                circleSize={28}
                                renderInsideCircle={() => (
                                    <View style={{borderWidth: 4, borderColor: pushKakao === true ? '#04dea0' : '#bababa', width: '100%', height: '100%', borderRadius: 13.5}}/>
                                )}
                            />
                        </View>
                        <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 12, color: '#909090', marginLeft: 32, marginTop: 3, flex: 1, lineHeight: 18}}>
                            {`거래에 관련된 알림이\n카카오톡 메시지로 전송됩니다.`}
                        </Text>
                    </View>
                    <View style={{height: 1, backgroundColor: '#f5f5f5'}}/>
                    <View style={{paddingVertical: 25}}>
                        <View style={[styles.flex_row, ]}>
                            <Image
                                style={{width: 24, height: 24}}
                                width={24}
                                height={24}
                                source={require('../../Assets/ic_email.png')}
                            />
                            <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 15, color: '#1e1e1e', marginLeft: 8, flex: 1, lineHeight: 24}}>이메일 알림</Text>
                            <Switch
                                value={pushEmail}
                                onValueChange={setPushEmail}
                                activeText={'ON'}
                                inActiveText={'OFF'}
                                backgroundActive={'#04dea0'}
                                backgroundInactive={'#bababa'}
                                circleActiveColor={'#ffffff'}
                                circleInActiveColor={'#ffffff'}
                                circleBorderWidth={0}
                                switchWidthMultiplier={2}
                                renderActiveText={false}
                                renderInActiveText={false}
                                circleSize={28}
                                renderInsideCircle={() => (
                                    <View style={{borderWidth: 4, borderColor: pushEmail === true ? '#04dea0' : '#bababa', width: '100%', height: '100%', borderRadius: 13.5}}/>
                                )}
                            />
                        </View>
                        <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 12, color: '#909090', marginLeft: 32, marginTop: 3, flex: 1, lineHeight: 18}}>
                            {`거래에 관련된 알림이\n이메일로 전송됩니다.`}
                        </Text>
                    </View>
                    <View style={{height: 1, backgroundColor: '#f5f5f5'}}/>
                    <View style={{paddingVertical: 25}}>
                        <View style={[styles.flex_row, ]}>
                            <Image
                                style={{width: 24, height: 24}}
                                width={24}
                                height={24}
                                source={require('../../Assets/ic_sale.png')}
                            />
                            <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 15, color: '#1e1e1e', marginLeft: 8, flex: 1, lineHeight: 24}}>이벤트 및 할인 알림</Text>
                            <Switch
                                value={pushEvent}
                                onValueChange={setPushEvent}
                                activeText={'ON'}
                                inActiveText={'OFF'}
                                backgroundActive={'#04dea0'}
                                backgroundInactive={'#bababa'}
                                circleActiveColor={'#ffffff'}
                                circleInActiveColor={'#ffffff'}
                                circleBorderWidth={0}
                                switchWidthMultiplier={2}
                                renderActiveText={false}
                                renderInActiveText={false}
                                circleSize={28}
                                renderInsideCircle={() => (
                                    <View style={{borderWidth: 4, borderColor: pushEvent === true ? '#04dea0' : '#bababa', width: '100%', height: '100%', borderRadius: 13.5}}/>
                                )}
                            />
                        </View>
                        <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 12, color: '#909090', marginLeft: 32, marginTop: 3, flex: 1, lineHeight: 18}}>
                            {`이벤트 및 할인에 대한 정보가\nPUSH 알림으로 전송됩니다.`}
                        </Text>
                    </View>
                    <View style={{height: 1, backgroundColor: '#f5f5f5'}}/>
                </ScrollView>
                <View style={{paddingHorizontal: 16, paddingVertical: 24}}>
                    <TouchableOpacity 
                        style={[styles.center, {height: 56, backgroundColor: '#ececec', borderRadius: 4, borderWidth: 1, borderColor: '#e0e0e0'}]}
                        onPress={onPressLogout}
                    >
                        <View style={styles.flex_row}>
                            <Image
                                style={{width: 24, height: 24}}
                                width={24}
                                height={24}
                                source={require('../../Assets/ic_logout.png')}
                            />
                            <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 16, color: '#1e1e1e', marginLeft: 8}}>로그아웃</Text>
                        </View>
                    </TouchableOpacity>
                </View>
           </SafeAreaView>
           
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#FFFFFF",
        flex: 1,
    },
    header: {
        height: 56,
        alignItems: 'center',
        justifyContent: 'center'
    },
    header_left: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        justifyContent: 'center',
        paddingHorizontal: 16
    },
    header_right: {
        position: 'absolute',
        top: 0,
        right: 0,
        height: '100%',
        justifyContent: 'center',
        paddingHorizontal: 16
    },
    price: {
        height: 24, 
        paddingHorizontal: 8, 
        justifyContent: 'center', 
        borderRadius: 2, 
        alignSelf: 'baseline'
    },
    heart_container_on: {
        width: 40, 
        height: 40, 
        borderRadius: 100, 
        backgroundColor: '#04dea0'
    },
    heart_container_off: {
        width: 40, 
        height: 40, 
        borderRadius: 100, 
        borderWidth: 1, 
        borderColor: '#bababa', 
    },
    flex_row: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    shadow: {
        shadowColor: '#aaa',
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 5
    },
    center: {
        alignItems: 'center',
        justifyContent: 'center'
    }
})

const mapStateToProps = state => {
    return {
    }
}

const mapDispatchToProps = {
    logout,
    showAlert,
    setApiLoading
}

export default connect(
    mapStateToProps, 
    mapDispatchToProps
)(SettingScreen);
