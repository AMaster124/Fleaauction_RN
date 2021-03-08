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
    TextInput,
     Platform
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
import ImagePicker from 'react-native-image-crop-picker'
import {TextInputMask} from 'react-native-masked-text'

import {showPhotoSelection} from '../../Redux/action/ModalAction'
import PhotoSelectionModal from '../../Components/Modals/PhotoSelectionModal';
import {userUpdate} from '../../Redux/action/globalAction'

import {setApiLoading} from '../../Redux/action/globalAction'
import {showAlert} from '../../Redux/action/AlertAction'
import APIKit from '../../Config/APIKit';


const ProfileEditScreen = (props) => {
    const {navigation, user, userUpdate, showPhotoSelection, setApiLoading, showAlert} = props

    const [nickname, setNickname] = useState(user.name)
    const [phone, setPhone] = useState(user.phone)
    const [image, setImage] = useState(user.photo)
    const [postCode, setPostCode] = useState(user.postal_code)
    const [address, setAddress] = useState(user.address)
    const [addressDetail, setAddressDetail] = useState(user.address_detail)
    
    const pickedImage = (res) => {
        console.log(res)
        setImage(`data:image/jpeg;base64,${res.data}`)
    }

    const onPressPhotoType = (index) => {
        if(index === 0) {                    // 촬영
            ImagePicker.openCamera(
                {
                    mediaType: 'photo',
                    cropping: true,
                    includeBase64: true,
                    width: 128,
                    height: 128
                }) .then( response => {
                    pickedImage(response)
                }) .catch(e => {
                    console.log(e)
            })
        } else if ( index === 1 ) {          // 앨범
            ImagePicker.openPicker(
                {
                    mediaType: 'photo',
                    cropping: true,
                    includeBase64: true,
                    width: 128,
                    height: 128
                }) .then( response => {
                    pickedImage(response)
                }) .catch(e => {
                    console.log(e)
            })
        }
    }

    const onPressUpdate = () => {
        const payload = {
            name: nickname,
            photo: image,
            phone: '010-0000-1230'.replace(/-/g, ''),
            postal_code: postCode,
            address: address,
            address_detail: addressDetail
        }

        console.log(payload)

        userUpdate(payload, () => {
            navigation.pop()
        })
    }

    const onPressDuplicatedName = () => {
        setApiLoading(true)
        const payload = {name: nickname}
        APIKit.post('users/name-validate', payload)
        .then( (res) => {
            setApiLoading(false)
            const data = res.data
            if(!data) {
                return
            }

            showAlert({message: data.msg})
        })
        .catch(error => {
            setApiLoading(false)
            console.log('users/name-validate', error.message)
        })
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
                    <TouchableOpacity 
                        style={styles.header_right}
                        onPress={()=>{navigation.push('SettingScreen')}}
                    >
                        <Image
                            style={{width: 24, height: 24, tintColor: '#1e1e1e'}}
                            width={24}
                            height={24}
                            source={require('../../Assets/ic_setting.png')}
                        />
                    </TouchableOpacity>
                    <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 18, color: '#1e1e1e'}}>개인정보 수정</Text>
                </View>
                <View style={{width: '100%', height: 1, backgroundColor: '#ececec'}}/>
                <KeyboardAwareScrollView style={{flex: 1}}>
                    <View style={{alignItems: 'center'}}>
                        <Image
                            style={{width: 100, height: 100, borderRadius: 200, marginTop: 24}}
                            source={image ? {uri: image} : require('../../Assets/ic_profile_circle.png')}
                        />
                        <TouchableOpacity
                            style={[styles.flex_row, {marginTop: 16, marginBottom: 20, paddingHorizontal: 16, height: 32, borderRadius: 200, backgroundColor: '#ececec'}]}
                            onPress={()=>{showPhotoSelection(true)}}
                        >
                            <Image
                                style={{width: 16, height: 16}}
                                width={16}
                                height={16}
                                source={require('../../Assets/ic_camera.png')}
                            />
                            <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 14, color: '#1e1e1e', marginLeft: 2}}>사진교체</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{height: 8, backgroundColor: '#ececec', marginVertical: 4}}/>
                    <View style={{paddingHorizontal: 16, paddingTop: 24, paddingBottom: 32}}>
                        <View style={[styles.flex_row]}>
                            <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 14, color: '#555555', width: 50}}>닉네임</Text>
                            <View style={[styles.flex_row, {flex: 1, height: 48, borderColor: '#e0e0e0', marginLeft: 6, borderWidth: 1}]}>
                                <TextInput
                                    style={[styles.text_input, {marginHorizontal: 16, flex: 1}]}
                                    placeholder={''}
                                    placeholderTextColor={'#909090'}
                                    autoCapitalize={'none'}
                                    value={nickname}
                                    onChangeText={setNickname}
                                />
                                <TouchableOpacity 
                                    style={{position: 'absolute', right: 16, top: 0, bottom: 0, justifyContent: 'center'}}
                                    onPress={onPressDuplicatedName}
                                >
                                    <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 14, color: '#04dea0'}}>중복확인</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={[styles.flex_row, {marginTop: 8}]}>
                            <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 14, color: '#555555', width: 50}}></Text>
                            <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 12, color: '#ee4442', marginLeft: 6, lineHeight: 18}}>
                                {`*욕설 및 비속어, 선정적 표현은 사용할 수 없습니다.\n*한글, 영문, 숫자(4~20자)\n*20일 이내 닉네임 변경 불가`}
                            </Text>
                        </View>
                        <View style={[styles.flex_row, {marginTop: 32}]}>
                            <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 14, color: '#909090', width: 50}}>
                                주소
                            </Text>
                            <View
                                style={{justifyContent: 'center', height: 48, flex: 1, marginLeft: 6, borderRadius: 2, borderColor: '#e0e0e0', borderWidth: 1, paddingHorizontal: 12, backgroundColor: '#f5f5f5'}}
                            >
                                <Text 
                                    style={{fontSize: 14, color: '#1e1e1e'}}
                                >
                                    {postCode}
                                </Text>
                            </View>
                            
                            <TouchableOpacity
                                style={[ styles.center, {height: 48, width: 112, backgroundColor: '#666666', color: 'white', borderRadius: 2, marginLeft: 8}]}
                                onPress={()=>{navigation.push('DaumPostCodeScreen', {setCode: setPostCode, setAddress: setAddress})}}
                            >
                                <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 14, color: '#ffffff'}}>우편번호 검색</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.flex_row, {marginTop: 8}]}>
                            <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 14, color: '#909090', width: 50}}>
                            </Text>
                            <View 
                                style={{height: 48, flex: 1, justifyContent: 'center', marginLeft: 6, borderRadius: 2, borderColor: '#e0e0e0', borderWidth: 1, paddingHorizontal: 12, backgroundColor: '#f5f5f5'}}
                            >
                                <Text
                                    style={{fontSize: 14, color: '#1e1e1e'}}
                                >
                                    {address}
                                </Text>
                            </View>
                        </View>
                        <View style={[styles.flex_row, {marginTop: 8}]}>
                            <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 14, color: '#909090', width: 50}}>
                            </Text>
                            <TextInput 
                                placeholder={'상세 주소를 입력해 주세요.'}
                                placeholderTextColor={'#909090'}
                                value={addressDetail}
                                onChangeText={(text) => {setAddressDetail(text)}}
                                style={{height: 48, flex: 1, fontSize: 14, color: '#1e1e1e', marginLeft: 6, borderRadius: 2, borderColor: '#e0e0e0', borderWidth: 1, paddingHorizontal: 12}}
                            />
                        </View>
                        <View style={[styles.flex_row, {marginTop: 8}]}>
                            <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 14, color: '#555555', width: 50}}/>
                            <Text style={{fontFamily: 'NotoSansCJKkr-Regular', flex: 1, fontSize: 12, color: '#ee4442', marginLeft: 6, lineHeight: 18}}>
                                *주소는 주문 배송 시, ‘배송지 불러오기’에 쓰이므로 정확한 주소 입력 부탁드립니다.
                            </Text>
                        </View>
                        <View style={[styles.flex_row,{marginTop: 32}]}>
                            <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 14, color: '#555555', width: 50}}>휴대폰</Text>
                            <View style={[styles.flex_row, {flex: 1, height: 48, borderColor: '#e0e0e0', marginLeft: 6, borderWidth: 1}]}>
                                <TextInputMask
                                    type={'custom'}
                                    options={{
                                        mask: '999-9999-9999'
                                    }}
                                    style={[styles.text_input, {marginHorizontal: 16, flex: 1}]}
                                    placeholder={''}
                                    placeholderTextColor={'#909090'}
                                    autoCapitalize={'none'}
                                    value={phone}
                                    onChangeText={setPhone}
                                />
                                <TouchableOpacity style={{position: 'absolute', right: 16, top: 0, bottom: 0, justifyContent: 'center'}}>
                                    <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 14, color: '#04dea0'}}>재인증</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </KeyboardAwareScrollView>
                <TouchableOpacity 
                    style={[styles.center, {height: 64, backgroundColor: '#04dea0'}]}
                    onPress={onPressUpdate}
                >
                    <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 18, color: '#ffffff'}}>수정완료</Text>
                </TouchableOpacity>
           </SafeAreaView>
           <PhotoSelectionModal
                okAction={onPressPhotoType}
                dismissAction={()=>{showPhotoSelection(false)}}
            />
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
        user: state.global.user
    }
}

const mapDispatchToProps = {
    userUpdate,
    showPhotoSelection,
    setApiLoading, 
    showAlert
}

export default connect(
    mapStateToProps, 
    mapDispatchToProps
)(ProfileEditScreen);
