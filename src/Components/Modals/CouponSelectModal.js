import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    Animated, 
    Image, 
    TextInput, 
    LogBox, 
    Dimensions, 
    KeyboardAvoidingView,
    ScrollView,
    Platform
} from "react-native"
import {connect} from 'react-redux';
import { TouchableHighlight, TouchableOpacity } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

let height = Dimensions.get('window').height - 30

const CouponSelectModal = (props) => {
    const {navigation, isOpen, okAction, dismissAction, coupons, setCoupons, price} = props
    console.log(coupons)

    const [show, setShow] = useState(false)
    const [selIndex, setSelIndex] = useState(0)
    const [bottomHeight] = useState(new Animated.Value(0))
    const [basePrice, setBasePrice] = useState(0)

    LogBox.ignoreLogs(['Animated: `useNativeDriver`'])

    useEffect(()=>{
        if(isOpen) {
            setShow(true)
            Animated.timing(bottomHeight, {
                toValue: -height,
                duration: 300,
                useNativeDriver: true
            }).start()
        } else {
            Animated.timing(bottomHeight, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true
            }).start(()=>{setShow(false);})
        }
    }, [isOpen])

    useEffect(() => {
        if(price) {
            setBasePrice(price)
        }
    }, [price])

    const _okHandler = (selected) => {
        setSelIndex(selected)
        okAction(selected);
        dismissAction();
    }

    const _renderCoupon = (item, key) => {
        return (
            <TouchableOpacity
                key = {key}
                onPress = {()=>{setSelIndex(key)}} 
                style={[styles.filter_item, {borderColor: selIndex === key ? '#04dea0' : '#ececec'}]}
            >
                <Image
                    style={{width: 24, height: 24}}
                    width={24}
                    height={24}
                    source={selIndex === key ? require('../../Assets/ic_radio_on.png') : require('../../Assets/ic_radio_off.png')}
                />
                <View style={{marginLeft: 8}}>
                    <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 15, color: '#1e1e1e', lineHeight: 24}}>
                        -{item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원
                    </Text>
                    <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 14, color: '#1e1e1e', lineHeight: 24}}>
                        회원가입 이벤트 5% 할인
                    </Text>
                    <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 12, color: '#666666', lineHeight: 24}}>
                        (5만 원 이상 구매시, 2021.12.31 까지)
                    </Text>
                </View>
            </TouchableOpacity>
        )
    }
    if( show ) {
        // const height = 400*bgOpacity/0.5
        return (
            <KeyboardAvoidingView 
                style={styles.container}
                behavior={Platform.OS == "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS == "ios" ? 0 : 20}
                enabled={Platform.OS === "ios" ? true : false}
            >
                <Animated.View style={[{flex: 1, backgroundColor: "#000000", opacity: 0.8}]}>
                    <View style={{flex: 1, width: '100%'}}>
                        <TouchableHighlight onPress = {dismissAction} style={{height: '100%', width: '100%'}}>
                            <View/>
                        </TouchableHighlight>
                    </View>
                </Animated.View>
                <Animated.View style={[styles.body_container, {height: height, transform: [{ translateY: bottomHeight }]}]}>
                    <View style={[styles.center, {height: 56, backgroundColor: '#ececec'}]}>
                        <View 
                            style={[styles.center, {position: 'absolute', top: 0, right: 0, bottom: 0}]}
                        >
                            <TouchableOpacity 
                                style={{paddingHorizontal: 16}}
                                onPress={dismissAction}
                            >
                                <MaterialCommunityIcons name='close' size={24} color={'#1e1e1e'}/>
                            </TouchableOpacity>
                        </View>
                        <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 18, color: '#1e1e1e'}}>쿠폰 선택</Text>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-evenly', paddingVertical: 12, backgroundColor: '#666666', paddingHorizontal: 12}}>
                        <View style={{alignItems: 'center'}}>
                            <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 12, color: '#bababa', lineHeight: 18}}>상품+배송비</Text>
                            <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 14, color: '#ffffff', lineHeight: 24, marginTop: 2}}>
                                {basePrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원
                            </Text>
                        </View>
                        <Image
                            style={{width: 16, height: 16, marginBottom: 5}}
                            source={require('../../Assets/ic_minus_circle.png')}
                        />
                        <View style={{alignItems: 'center'}}>
                            <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 12, color: '#bababa', lineHeight: 18}}>쿠폰할인</Text>
                            <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 14, color: '#ffffff', lineHeight: 24, marginTop: 2}}>
                                {coupons && coupons[selIndex].price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원
                            </Text>
                        </View>
                        <Image
                            style={{width: 16, height: 16, marginBottom: 5}}
                            source={require('../../Assets/ic_equal_circle.png')}
                        />
                        <View style={{alignItems: 'center'}}>
                            <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 12, color: '#bababa', lineHeight: 18}}>결제예정금액</Text>
                            <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 14, color: '#04dea0', lineHeight: 24, marginTop: 2}}>
                                {coupons && (basePrice-coupons[selIndex].price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원
                            </Text>
                        </View>
                    </View>
                    <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 14, color: '#1e1e1e', marginLeft: 8, marginLeft: 16, marginTop: 20, lineHeight: 24}}>
                        할인코드 입력
                    </Text>
                    <View style={[styles.flex_row, {marginHorizontal: 16, marginBottom: 20, marginTop: 16}]}>
                        <TextInput 
                            placeholder={'할인코드를 입력해주세요.'}
                            placeholderTextColor='#909090'
                            style={{height: 48, flex: 1, fontSize: 14, color: '#1e1e1e', borderRadius: 2, borderColor: '#e0e0e0', borderWidth: 1, paddingHorizontal: 12, backgroundColor: '#f5f5f5'}}
                        />
                        <TouchableOpacity
                            style={[ styles.center, {height: 48, width: 80, backgroundColor: '#666666', color: 'white', borderRadius: 2, marginLeft: 8}]}
                        >
                            <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 14, color: '#ffffff'}}>등록</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{height: 1, backgroundColor: '#ececec'}}/>
                    <ScrollView style={{flex: 1, paddingHorizontal: 16, paddingVertical: 20}}>
                        {
                            coupons && coupons.map((item, key) => {
                                return _renderCoupon(item, key)
                            })
                        }
                        <View style={{height: 40}}/>
                    </ScrollView>
                    <TouchableOpacity 
                        style={[styles.center, {height: 64, backgroundColor: '#04dea0'}]}
                        onPress={()=>{}}
                    >
                        <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 18, color: '#ffffff'}}>
                            쿠폰적용
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
            </KeyboardAvoidingView>
        );
        
    } else {
        return null
    }
}

const styles = StyleSheet.create({
    center: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    },
    body_container: {
        position: 'absolute',
        bottom: -height,
        left: 0,
        width: '100%', 
        backgroundColor: 'white', 
        borderTopLeftRadius: 16, 
        borderTopRightRadius: 16, 
        overflow: 'hidden',
        marginTop: -20,
        height: height
    },
    filter_item: {
        padding: 16,
        borderRadius: 4,
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12
    },
    flex_row: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    flex_row_reverse: {
        flexDirection: "row-reverse",
        alignItems: 'center'
    },
    shadow: {
        shadowColor: '#555',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.3,
        shadowRadius: 1,
        elevation: 5
    },
})

const mapStateToProps = state => {
    return {
        isOpen: state.modal.showCouponSelection,
    }
}

const mapDispatchToProps = {
}

export default connect(
    mapStateToProps, 
    mapDispatchToProps
)(CouponSelectModal);
