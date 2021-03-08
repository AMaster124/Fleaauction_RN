import React from 'react';
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
import KakaoLogins, {KAKAO_AUTH_TYPES} from '@react-native-seoul/kakao-login'

const LoginStartScreen = (props) => {
    const {navigation} = props

    const gotoSocialAgree = (email) => {
        console.log(email)
        navigation.push('SocialAgreeScreen', {email: email})
    }

    const getKakaoProfile = () => {
        KakaoLogins.getProfile()
          .then(result => {
                if(result.email === null) {
                    showAlert({message: '카카오인증 권한이 없습니다.'})
                    return
                }
                KakaoLogins.logout()
                gotoSocialAgree(result.email)
      })
          .catch(err => {
            console.log(`Get Profile Failed:${err.code} ${err.message}`)
          });
    };

    const onPressRegister = () => {
        navigation.push('RegisterScreen')
    }

    const onPressLogin = () => {
        navigation.push('LoginEmailScreen')
    }

    const onPressKakaoLogin = () => {
        KakaoLogins.login([KAKAO_AUTH_TYPES.Talk])
            .then(result => {
                getKakaoProfile()
            })
            .catch(err => {
                if (err.code === 'E_CANCELLED_OPERATION') {
                    console.log(`Login Cancelled:${err.message}`)
                } else {
                    console.log(`Login Failed:${err.code} ${err.message}`)
                }
            })
    }

    return (
        <View style={[styles.container]}>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={{flex: 1}}>
                <View style={[styles.center, {flex: 1}]}>
                    <View style={{alignItems: 'center', width: '100%', paddingHorizontal: 24}}>
                        <View style={[styles.center, {width: 120, height: 120, borderRadius: 60, borderWidth: 0, borderColor: '#04dea0', backgroundColor: '#000000'}]}>
                            <Image
                                style={{width: 50}}
                                width={50}
                                resizeMode={'contain'}
                                source={require('../../Assets/logo.png')}
                            />
                        </View>
                        <Text style={{fontFamily: 'NotoSansCJKkr-Bold', fontSize: 20, color: '#1e1e1e', textAlign: 'center', marginTop: 32}}>{`플리옥션\n기부, 일상이 되다`}</Text>
                        <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 16, color: '#1e1e1e', textAlign: 'center', marginTop: 16}}>실시간 경매에 참여하고 기부도 함께 하세요.</Text>
                        <TouchableOpacity 
                            style={[styles.center, {width: '100%', height: 56, borderRadius: 4, backgroundColor: '#04dea0', marginTop: 40}]}
                            onPress={onPressRegister}
                        >
                            <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 16, color: '#ffffff'}}>회원가입</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.center, {width: '100%', height: 56, borderRadius: 4, borderWidth: 1, borderColor:  '#04dea0', marginTop: 16}]}
                            onPress={onPressLogin}
                        >
                            <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 16, color: '#04dea0'}}>로그인</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                                style={[styles.flex_row, {width: '100%', height: 56, borderRadius: 4, backgroundColor: '#fee500', marginTop: 24}]}
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
                    </View>
                </View>
                <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 12, color: '#888888', alignSelf: 'center', marginBottom: 32}}>ⓒ FLEA AUCTION All Rights Reserved.</Text>
            </SafeAreaView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#FFFFFF",
        flex: 1,
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
    },
    button_img: {
        marginLeft: 24,
        width: 24,
        height: 24
    },
    button_text: {
        fontFamily: 'NotoSansCJKkr-Regular',
        fontSize: 16, 
        flex: 1,
        textAlign: 'center',
        marginRight: 24
    },
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
)(LoginStartScreen);
