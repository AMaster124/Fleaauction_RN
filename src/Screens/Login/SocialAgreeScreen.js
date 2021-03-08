import React, {useState, useEffect, useRef} from 'react';
import {connect} from 'react-redux';

import { 
    StyleSheet, 
    View,
    Image,
    SafeAreaView,
    TouchableOpacity,
    Text,
    StatusBar,
    ScrollView
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'

import {
    login,
    setApiLoading
} from '../../Redux/action/globalAction'
import {showAlert} from '../../Redux/action/AlertAction'
import APIKit from '../../Config/APIKit';

const SocialAgreeScreen = (props) => {
    const {navigation, login} = props

    const [agreeAll, setAgreeAll] = useState(false)
    const [agreeService, setAgreeService] = useState(false)
    const [agreePrivacy, setAgreePrivacy] = useState(false)
    const [agreeEMarket, setAgreeEMarket] = useState(false)
    const [agreeMarket, setAgreeMarket] = useState(false)

    const updateAllCheck = (checked) => {
        setAgreeService(checked)
        setAgreePrivacy(checked)
        setAgreeMarket(checked)
        setAgreeEMarket(checked)
    }

    const availableConfirm = () => {
        return agreeService === true && agreePrivacy === true && agreeEMarket === true
    }

    const onPressAllAgree = (checked) => {
        updateAllCheck(checked)
        setAgreeAll(checked)
    }

    const onPressServiceAgree = (checked) => {
        if(checked === true && agreePrivacy === true && agreeMarket === true && agreeEMarket === true) {
            if(agreeAll === false) {
                setAgreeAll(true)
            }
        } else {
            if( agreeAll === true) {
                setAgreeAll(false)
            }
        }

        setAgreeService(checked)
    }

    const onPressPrivacyAgree = (checked) => {
        if(checked === true && agreeService === true && agreeMarket === true && agreeEMarket === true) {
            if(agreeAll === false) {
                setAgreeAll(true)
            }
        } else {
            if( agreeAll === true) {
                setAgreeAll(false)
            }
        }

        setAgreePrivacy(checked)
    }

    const onPressEMarketAgree = (checked) => {
        if(checked === true && agreePrivacy === true && agreeMarket === true && agreeService === true) {
            if(agreeAll === false) {
                setAgreeAll(true)
            }
        } else {
            if( agreeAll === true) {
                setAgreeAll(false)
            }
        }

        setAgreeEMarket(checked)
    }

    const onPressMarketAgree = (checked) => {
        if(checked === true && agreePrivacy === true && agreeService === true && agreeEMarket === true) {
            if(agreeAll === false) {
                setAgreeAll(true)
            }
        } else {
            if( agreeAll === true) {
                setAgreeAll(false)
            }
        }

        setAgreeMarket(checked)
    }

    const onPressConfirm = () => {
        const email = props.route.params.email
        if(email) {
            setApiLoading(true)
            const payload = {email: email}
            APIKit.post('auth/jwt-auth', payload)
            .then( (res) => {
                setApiLoading(false)
                const data = res.data
                if(!data) {
                    return
                }

                const status = data.status
                if(status === true) {
                    login({type: 'kakao', token: data.results})
                } else {
                    showAlert({message: data.msg})
                }
            })
            .catch(error => {
                setApiLoading(false)
                console.log('auth/jwt-auth', error.message)
            })
        }
    }

    return (
        <View style={[styles.container]}>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={{flex: 1}}>
                <View style={styles.header}>
                    <TouchableOpacity 
                        style={styles.header_left}
                        onPress={()=>{navigation.pop()}}
                    >
                        <Ionicons
                            size={24}
                            color={'#1e1e1e'}
                            name={'chevron-back'}
                        />
                    </TouchableOpacity>
                    <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 18, color: '#1e1e1e'}}>이용약관</Text>
                </View>
                <ScrollView style={{flex: 1}}>
                    <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 20, color: '#1e1e1e', marginLeft: 16, marginTop: 24}}>
                        <Text style={{fontFamily: 'NotoSansCJKkr-Bold', fontSize: 20, color: '#1e1e1e'}}>
                            소셜 로그인
                        </Text>
                        {`을 위한\n이용약관에 동의해 주세요`}
                    </Text>
                    <TouchableOpacity 
                        style={[styles.flex_row, {paddingLeft: 16, marginTop: 32}]}
                        onPress={() => {
                            onPressAllAgree(!agreeAll)
                        }}
                    >
                        <Image
                            style={{width: 20, height: 20}}
                            width={20}
                            height={20}
                            source={
                                agreeAll === true ? require('../../Assets/ic_select_on.png') : require('../../Assets/ic_select_off.png')
                            }
                        />
                        <Text style={[{fontFamily: 'NotoSansCJKkr-Medium', color: '#1e1e1e', fontSize: 15, marginLeft: 8}]}>모두 확인, 동의합니다</Text>
                    </TouchableOpacity>
                    <View style={{padding: 16, backgroundColor: '#ececec', marginTop: 20}}>
                        <View style={[styles.flex_row, {marginTop: 8, justifyContent: 'space-between'}]}>
                            <TouchableOpacity 
                                style={[styles.flex_row]}
                                onPress={() => {onPressServiceAgree(!agreeService)}}
                            >
                                <Image
                                    style={{width: 20, height: 20}}
                                    width={20}
                                    height={20}
                                    source={
                                        agreeService === true ? require('../../Assets/ic_select_on.png') : require('../../Assets/ic_select_off.png')
                                    }
                                />
                                <Text style={[{fontFamily: 'NotoSansCJKkr-Medium', color: '#1e1e1e', fontSize: 15, marginLeft: 8}]}>[필수] 서비스 이용약관 동의</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={()=>{Linking.openURL(`${SERVER_URL}terms-condition`)}}
                            >
                                <Ionicons
                                    size={24}
                                    color={'#1e1e1e'}
                                    name={'chevron-forward'}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.flex_row, {marginTop: 8, justifyContent: 'space-between'}]}>
                            <TouchableOpacity 
                                style={[styles.flex_row]}
                                onPress={() => {onPressPrivacyAgree(!agreePrivacy)}}
                            >
                                <Image
                                    style={{width: 20, height: 20}}
                                    width={20}
                                    height={20}
                                    source={
                                        agreePrivacy === true ? require('../../Assets/ic_select_on.png') : require('../../Assets/ic_select_off.png')
                                    }
                                />
                                <Text style={[{fontFamily: 'NotoSansCJKkr-Medium', color: '#1e1e1e', fontSize: 15, marginLeft: 8}]}>[필수] 개인정보 취급방침 동의</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={()=>{Linking.openURL(`${SERVER_URL}terms-condition`)}}
                            >
                                <Ionicons
                                    size={24}
                                    color={'#1e1e1e'}
                                    name={'chevron-forward'}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.flex_row, {marginTop: 8, justifyContent: 'space-between'}]}>
                            <TouchableOpacity 
                                style={[styles.flex_row]}
                                onPress={() => {onPressEMarketAgree(!agreeEMarket)}}
                            >
                                <Image
                                    style={{width: 20, height: 20}}
                                    width={20}
                                    height={20}
                                    source={
                                        agreeEMarket === true ? require('../../Assets/ic_select_on.png') : require('../../Assets/ic_select_off.png')
                                    }
                                />
                                <Text style={[{fontFamily: 'NotoSansCJKkr-Medium', color: '#1e1e1e', fontSize: 15, marginLeft: 8}]}>[필수] 마케팅 정보 수신 동의</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={()=>{Linking.openURL(`${SERVER_URL}terms-condition`)}}
                            >
                                <Ionicons
                                    size={24}
                                    color={'#1e1e1e'}
                                    name={'chevron-forward'}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.flex_row, {marginTop: 8, justifyContent: 'space-between'}]}>
                            <TouchableOpacity 
                                style={[styles.flex_row]}
                                onPress={() => {onPressMarketAgree(!agreeMarket)}}
                            >
                                <Image
                                    style={{width: 20, height: 20}}
                                    width={20}
                                    height={20}
                                    source={
                                        agreeMarket === true ? require('../../Assets/ic_select_on.png') : require('../../Assets/ic_select_off.png')
                                    }
                                />
                                <Text style={[{fontFamily: 'NotoSansCJKkr-Medium', color: '#1e1e1e', fontSize: 15, marginLeft: 8}]}>[선택] 마케팅 정보 수신 동의</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={()=>{Linking.openURL(`${SERVER_URL}terms-condition`)}}
                            >
                                <Ionicons
                                    size={24}
                                    color={'#1e1e1e'}
                                    name={'chevron-forward'}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
                <TouchableOpacity 
                    style={[styles.center, {width: '100%', height: 64, backgroundColor: availableConfirm() ? '#04dea0' : '#bababa'}]}
                    disabled={!availableConfirm()}
                    onPress={onPressConfirm}
                >
                    <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 18, color: '#ffffff'}}>확인</Text>
                </TouchableOpacity>
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
        width: '100%',
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
    login
}

export default connect(
    mapStateToProps, 
    mapDispatchToProps
)(SocialAgreeScreen);
