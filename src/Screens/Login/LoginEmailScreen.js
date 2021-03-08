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
    Keyboard
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'

import {
    login,
} from '../../Redux/action/globalAction'

const LoginEmailScreen = (props) => {
    const {navigation, login} = props

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [focustEmail, setFocusEmail] = useState(false)
    const [focustPassword, setFocusPassword] = useState(false)

    const validateEmail = (email) => {
        const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
        return expression.test(String(email).toLowerCase())
    }

    const validatePassword = (password) => {
        const expression = /(?=[^a-z]*[a-z])(?=[^0-9]*[0-9])[a-zA-Z0-9]{6,16}$/;
        return expression.test(String(password).toLowerCase())
    }

    const availableConfirm = () => {
        return validateEmail(email) && validatePassword(password)
    }

    const onPressLogin = () => {
        Keyboard.dismiss()
        login({email: email, password: password})
    }

    const onPressForgotPassword = () => {
        navigation.push('ForgotPasswordScreen')
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
                    <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 18, color: '#1e1e1e'}}>이메일 로그인</Text>
                </View>

                <TextInput
                    style={[styles.text_input, {borderColor: focustEmail === true ? '#04dea0' : '#e0e0e0'}]}
                    placeholder={'이메일 주소'}
                    placeholderTextColor={'#909090'}
                    keyboardType={'email-address'}
                    autoCapitalize={'none'}
                    autoFocus={true}
                    onFocus={() => {setFocusEmail(true)}}
                    onEndEditing={()=>{setFocusEmail(false)}}
                    value={email}
                    onChangeText={setEmail}
                />
                
                <TextInput
                    style={[styles.text_input, {marginTop: 12, borderColor: focustPassword === true ? '#04dea0' : '#e0e0e0'}]}
                    placeholder={'비밀번호(6~16자, 영문/숫자)'}
                    placeholderTextColor={'#909090'}
                    secureTextEntry={true}
                    onFocus={() => {setFocusPassword(true)}}
                    onEndEditing={()=>{setFocusPassword(false)}}
                    value={password}
                    onChangeText={setPassword}
                />
                
                <TouchableOpacity 
                    style={[styles.center, {borderRadius: 4, marginHorizontal: 24, marginTop: 24, height: 56, backgroundColor: availableConfirm() ? '#04dea0' : '#bababa'}]}
                    disabled={!availableConfirm()}
                    onPress={onPressLogin}
                >
                    <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 18, color: '#ffffff'}}>로그인</Text>
                </TouchableOpacity>
                <View style={[styles.flex_row, {alignSelf: 'flex-end', paddingHorizontal: 24, marginTop: 16}]}>
                    <TouchableOpacity 
                        onPress={() => {navigation.push('RegisterScreen')}}
                    >
                        <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 14, color: '#555555'}}>회원가입</Text>
                    </TouchableOpacity>
                    <View style={{width: 1, height: 12, backgroundColor: '#bababa', marginHorizontal: 8}}/>
                    <TouchableOpacity
                        onPress={onPressForgotPassword}
                    >
                        <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 14, color: '#555555'}}>비밀번호 찾기</Text>
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
    text_input: {
        height: 48, 
        fontSize: 15, 
        color: '#1e1e1e', 
        backgroundColor: '#f5f5f5', 
        marginTop: 24, 
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
    login
}

export default connect(
    mapStateToProps, 
    mapDispatchToProps
)(LoginEmailScreen);
