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
    TextInput,
    ScrollView, 
    KeyboardAvoidingView,
    Platform,
    Keyboard, Linking
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'

import {register, emailValidate} from '../../Redux/action/globalAction'
import {SERVER_URL} from '../../Config/APIKit'

const RegisterScreen = (props) => {
    const {navigation, register, emailValidate} = props

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [focustEmail, setFocusEmail] = useState(false)
    const [focusPassword, setFocusPassword] = useState(false)
    const [focusConfirm, setFocusConfirm] = useState(false)

    const [agreeAll, setAgreeAll] = useState(false)
    const [agreeService, setAgreeService] = useState(false)
    const [agreePrivacy, setAgreePrivacy] = useState(false)
    const [agreeEMarket, setAgreeEMarket] = useState(false)
    const [agreeMarket, setAgreeMarket] = useState(false)

    const [doubleChecked, setDoubleChecked] = useState(null)
    const [validMessage, setValidMessage] = useState('')

    const updateAllCheck = (checked) => {
        setAgreeService(checked)
        setAgreePrivacy(checked)
        setAgreeMarket(checked)
        setAgreeEMarket(checked)
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

    const availableAgreeConfirm = () => {
        return agreeService === true && agreePrivacy === true && agreeEMarket === true
    }

    const validateEmail = (email) => {
        const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
        return expression.test(String(email).toLowerCase())
    }

    const validatePassword = (password) => {
        const expression = /(?=[^a-z]*[a-z])(?=[^0-9]*[0-9])[a-zA-Z0-9]{6,16}$/;
        return expression.test(String(password).toLowerCase())
    }

    const availableConfirm = () => {
        return validateEmail(email) && validatePassword(password) && availableAgreeConfirm()
    }

    const onPressRegister = () => {
        Keyboard.dismiss()
        register({email: email, password: password, confirm_password: confirm})
    }

    const onPressValidateEmail = () => {
        emailValidate({email: email, callback: (status, message) => {
            setDoubleChecked(status)
            setValidMessage(message)
        }})
    }

    const screenBody = () => {
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
                        <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 18, color: '#1e1e1e'}}>회원가입</Text>
                    </View>

                    <ScrollView style={{flex: 1}}>
                        <View style={[{marginTop: 24, marginHorizontal: 24}]}>
                            <TextInput
                                style={[styles.text_input, {borderColor: focustEmail === true ? '#04dea0' : '#e0e0e0', marginHorizontal: 0}]}
                                placeholder={'이메일 주소'}
                                placeholderTextColor={'#909090'}
                                keyboardType={'email-address'}
                                autoCapitalize={'none'}
                                autoFocus={true}
                                onFocus={() => {setFocusEmail(true)}}
                                onEndEditing={()=>{setFocusEmail(false)}}
                                value={email}
                                onChangeText={(val) => {
                                    if(doubleChecked !== null) {
                                        setDoubleChecked(null)
                                    }

                                    setEmail(val)
                                }}
                            />
                            <TouchableOpacity 
                                style={{position: 'absolute', right: 16, top: 0, bottom: 0, justifyContent: 'center'}}
                                onPress={onPressValidateEmail}
                            >
                                {
                                    doubleChecked === null ?
                                        <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 14, color: '#04dea0'}}>중복확인</Text>
                                    : 
                                        <Image 
                                            style={{width: 16, height: 16}} 
                                            width={16} 
                                            height={16}
                                            source={doubleChecked === true ? require('../../Assets/ic_check.png') : require('../../Assets/ic_error.png')}
                                        />
                                }
                            </TouchableOpacity>
                        </View>
                        {
                            doubleChecked === null ? null : 
                            <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 12, marginTop: 4, marginRight: 26, color: doubleChecked ? '#04dea0' : 'red', alignSelf: 'flex-end'}}>
                                *{validMessage}
                            </Text>
                        }
                        <TextInput
                            style={[styles.text_input, {marginTop: 12, borderColor: focusPassword === true ? '#04dea0' : '#e0e0e0'}]}
                            placeholder={'비밀번호(6~16자, 영문/숫자)'}
                            placeholderTextColor={'#909090'}
                            secureTextEntry={true}
                            onFocus={() => {setFocusPassword(true)}}
                            onEndEditing={()=>{setFocusPassword(false)}}
                            value={password}
                            onChangeText={setPassword}
                        >
                        </TextInput>
                        
                        <TextInput
                            style={[styles.text_input, {marginTop: 12, borderColor: focusConfirm === true ? '#04dea0' : '#e0e0e0'}]}
                            placeholder={'비밀번호 재입력'}
                            placeholderTextColor={'#909090'}
                            secureTextEntry={true}
                            onFocus={() => {setFocusConfirm(true)}}
                            onEndEditing={()=>{setFocusConfirm(false)}}
                            value={confirm}
                            onChangeText={setConfirm}
                        />
                        <View style={{padding: 16, backgroundColor: '#ececec', marginTop: 60}}>
                            <TouchableOpacity 
                                style={[styles.flex_row, {marginTop: 8}]}
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
                            <View style={{height: 1, backgroundColor: '#e0e0e0', marginVertical: 16}}/>
                            <View style={[styles.flex_row, {justifyContent: 'space-between'}]}>
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
                                >
                                    <Ionicons
                                        size={24}
                                        color={'#1e1e1e'}
                                        name={'chevron-forward'}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.flex_row, {marginTop: 16, justifyContent: 'space-between'}]}>
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
                            <View style={[styles.flex_row, {marginTop: 16, justifyContent: 'space-between'}]}>
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
                                    <Text style={[{fontFamily: 'NotoSansCJKkr-Medium', color: '#1e1e1e', fontSize: 15, marginLeft: 8}]}>[필수] 전자상거래 이용약관 동의</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                >
                                    <Ionicons
                                        size={24}
                                        color={'#1e1e1e'}
                                        name={'chevron-forward'}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.flex_row, {marginTop: 16, justifyContent: 'space-between'}]}>
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
                        style={[styles.center, {height: 64, backgroundColor: availableConfirm() ? '#04dea0' : '#bababa'}]}
                        disabled={!availableConfirm()}
                        onPress={onPressRegister}
                    >
                        <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 18, color: '#ffffff'}}>확인</Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </View>

        )
    }

    return (
        Platform.OS === 'ios' ?
            <KeyboardAvoidingView 
                behavior={"padding"} 
                style={{flex: 1}}
            >
                {screenBody()}
            </KeyboardAvoidingView>
        : screenBody()
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
    text_input: {
        height: 48, 
        fontSize: 15, 
        color: '#1e1e1e', 
        backgroundColor: '#f5f5f5', 
        marginHorizontal: 24, 
        paddingHorizontal: 16,
        borderWidth: 1,
        borderRadius: 2
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
    register,
    emailValidate
}

export default connect(
    mapStateToProps, 
    mapDispatchToProps
)(RegisterScreen);
