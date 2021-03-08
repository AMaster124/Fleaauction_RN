import React, {useState, useEffect, useRef} from 'react';
import {connect} from 'react-redux';

import { 
    StyleSheet, 
    View,
    Image,
    SafeAreaView,
    TouchableOpacity,
    Text,
    StatusBar
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'
import KakaoLogins, {KAKAO_AUTH_TYPES} from '@react-native-seoul/kakao-login'

const LoginMainScreen = (props) => {
    const {navigation} = props

    const gotoSocialAgree = () => {
        navigation.push('SocialAgreeScreen')
    }

    const getKakaoProfile = (user) => {
        KakaoLogins.getProfile()
          .then(result => {
                if(result.email === null) {
                    showAlert({message: '카카오인증 권한이 없습니다.'})
                    return
                }
                KakaoLogins.logout()
                // gotoSocialAgree({email: result.email})
      })
          .catch(err => {
            console.log(`Get Profile Failed:${err.code} ${err.message}`)
          });
    };

    const onPressFacebookLogin = () => {
        gotoSocialAgree()
    }

    const onPressKakaoLogin = () => {
        KakaoLogins.login([KAKAO_AUTH_TYPES.Talk])
            .then(result => {
                let user = {"token": result.accessToken ? result.accessToken : 'kaokaokaokaokaokaokaokaokaokaokaokaokaokaokaokaokaokao'}
                getKakaoProfile(user)
            })
            .catch(err => {
                if (err.code === 'E_CANCELLED_OPERATION') {
                    console.log(`Login Cancelled:${err.message}`)
                } else {
                    console.log(`Login Failed:${err.code} ${err.message}`)
                }
            })
    }

    const onPressGoogleLogin = () => {
        gotoSocialAgree()

    }

    const onPressEmailLogin = () => {
        navigation.push('LoginEmailScreen')
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
                    <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 18, color: '#1e1e1e'}}>로그인</Text>
                </View>
                <View style={styles.content}>
                    <TouchableOpacity 
                        style={[styles.flex_row, {width: '100%', height: 56, borderRadius: 4, backgroundColor: '#1877f2'}]}
                        onPress={onPressFacebookLogin}
                    >
                        <Image
                            style={[styles.button_img]}
                            width={24}
                            height={24}
                            source={require('../../Assets/logo_facebook.png')}
                        />
                        <Text style={[styles.button_text, {color: 'white'}]}>페이스북 계정으로 로그인</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.flex_row, {width: '100%', height: 56, borderRadius: 4, backgroundColor: '#fee500', marginTop: 16}]}
                        onPress={onPressKakaoLogin}
                    >
                        <Image
                            style={[styles.button_img]}
                            width={24}
                            height={24}
                            source={require('../../Assets/logo_kakao.png')}
                        />
                        <Text style={[styles.button_text, {color: '#1e1e1e'}]}>카카오 계정으로 로그인</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.flex_row, {width: '100%', height: 56, borderRadius: 4, marginTop: 16, borderWidth: 1, borderColor: '#bababa'}]}
                        onPress={onPressGoogleLogin}
                    >
                        <Image
                            style={[styles.button_img]}
                            width={24}
                            height={24}
                            source={require('../../Assets/logo_google.png')}
                        />
                        <Text style={[styles.button_text, {color: '#1e1e1e'}]}>구글 계정으로 로그인</Text>
                    </TouchableOpacity>
                    <View style={[styles.flex_row, {marginTop: 40}]}>
                        <View style={{height: 1, flex: 1, backgroundColor: '#e0e0e0'}}/>
                        <Text style={{fontFamily: 'NotoSansCJKkr-Regular', color: '#555555', fontSize: 14, paddingHorizontal: 20}}>또는</Text>
                        <View style={{height: 1, flex: 1, backgroundColor: '#e0e0e0'}}/>
                    </View>
                    <TouchableOpacity 
                        style={[styles.flex_row, {width: '100%', height: 56, borderRadius: 4, backgroundColor: '#ececec', marginTop: 40}]}
                        onPress={onPressEmailLogin}
                    >
                        <Image
                            style={[styles.button_img]}
                            width={24}
                            height={24}
                            source={require('../../Assets/ic_email.png')}
                        />
                        <Text style={[styles.button_text, {color: '#1e1e1e'}]}>이메일 계정으로 로그인</Text>
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
    content: {
        padding: 24
    },
    flex_row: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    button_text: {
        fontFamily: 'NotoSansCJKkr-Regular',
        fontSize: 16, 
        flex: 1,
        textAlign: 'center',
        marginRight: 24
    },
    button_img: {
        marginLeft: 24,
        width: 24,
        height: 24
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
}

export default connect(
    mapStateToProps, 
    mapDispatchToProps
)(LoginMainScreen);
