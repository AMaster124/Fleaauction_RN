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
    Button
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'
import HTML from 'react-native-render-html'
import IMP from 'iamport-react-native'
import {TextInputMask} from 'react-native-masked-text'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
import {setApiLoading} from '../../Redux/action/globalAction'
import {showAlert} from '../../Redux/action/AlertAction'
import APIKit from '../../Config/APIKit';

import CouponSelectModal from '../../Components/Modals/CouponSelectModal';
import {showCouponSelection} from '../../Redux/action/ModalAction'

const WinBidPayScreen = (props) => {
    const sample_aution = {name: 'Tasaki 다이아몬드 반지', brand: 'Tasaki', model: 'BRILLANTE Solitaire Ring', modelNo: 'RD-F1739-PT950', size: 'Small', price: 600000, img: 'https://openimage.interpark.com/goods_image_big/0/2/0/7/7043100207b_l.png'}

    const {navigation, user, setApiLoading, showAlert, showCouponSelection} = props

    const [fee, setFee] = useState(3000)
    const [coupons, setCoupons] = useState(null)
    const [selCoupon, setSelCoupon] = useState(null)
    const [auction, setAuction] = useState(null)
    
    const [same_order, setSameOrder] = useState(false)
    const [ship_dest, setShipDest] = useState(false)

    const [orderName, setOrderName] = useState(user.name)
    const [orderPhone, setOrderPhone] = useState(user.phone)
    const [buyerName, setBuyerName] = useState('')
    const [buyerPhone, setBuyerPhone] = useState('')
    const [postCode, setPostCode] = useState('')
    const [address, setAddress] = useState('')
    const [buyerDetail, setBuyerDetail] = useState('')
    const [deliverMsg, setDeliverMsg] = useState('')

    const [payMethod, setPayMethod] = useState('card')

    useEffect(() => {
        setApiLoading(true)
        APIKit.post('auctions/auction-detail-payment', {auction_id: navigation.state.params.auction_id})
        .then( (res) => {
            const data = res.data
            if(!data) {
                return
            }

            if(data.status === true) {
                setAuction(data.results)
                setCoupons(data.results.coupons)
            } else {
                showAlert({message: data.msg[0]})
            }
            setApiLoading(false)
        })
        .catch(error => {
            setApiLoading(false)
            console.log('auctions/auction-detail-payment', error.message)
        }) 
    }, [])

    useEffect(() => {
        if(same_order === true) {
            setBuyerName(orderName)
            setBuyerPhone(orderPhone)
        } 
    }, [same_order])

    useEffect(() => {
        if(ship_dest === true) {
            setAddress(user.address)
            setBuyerDetail(user.address_detail)
            setPostCode(user.postal_code)
        } 
    }, [ship_dest])

    const paymentCallback = (response) => {
        alert(JSON.stringify(response))
    }

    if(false) {
        return(
            <IMP.Payment
                userCode={'imp66175943'}
                tierCode={'AAA'}
                loading={
                    <View style={[styles.center, {...StyleSheet.absoluteFillObject}]}>
                        <Text>잠시만 기다려주세요...</Text>
                    </View>
                }
                data={{
                    pg: 'alipay',
                    pay_method: 'card',
                    name: '아임포트 결제 테스트',
                    merchant_uid: `mid_${new Date().getTime()}`,
                    amount: '39000',
                    buyer_name: '홍길동',
                    buyer_tel: '01012345678',
                    buyer_email: 'bestfriend1990124@outlook.com',
                    buyer_addr: '서울시 강남구 신사동 661-16',
                    buyer_postcode: '06018',
                    app_scheme: 'fleaauction'
                }}
                callback={paymentCallback}
            />
        )
    } else {
        return (
            auction &&
            <View style={[styles.container]}>
                <StatusBar barStyle="dark-content" />
                <SafeAreaView style={{flex: 1}}>
                    <View style={styles.header}>
                        <TouchableOpacity 
                            style={styles.header_right}
                            onPress={()=>{navigation.pop()}}
                        >
                            <Ionicons
                                size={24}
                                color={'#1e1e1e'}
                                name={'close'}
                            />
                        </TouchableOpacity>
                        <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 18, color: '#1e1e1e'}}>낙찰금 결제</Text>
                    </View>
                    <View style={{width: '100%', height: 1, backgroundColor: '#ececec'}}/>
                    <KeyboardAwareScrollView style={{flex: 1, backgroundColor: '#ececec'}}>
                        <View style={{backgroundColor: 'white', paddingHorizontal: 16, paddingTop: 24, paddingBottom: 32}}>
                            <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 16, color: '#1e1e1e'}}>낙찰 상품 정보</Text>
                            <View style={[{flexDirection: 'row', marginTop: 20}]}>
                                <Image
                                    style={{width: 112, height: 112, borderRadius: 4}}
                                    width={112}
                                    height={112}
                                    resizeMode={'cover'}
                                    source={{uri: auction.image ? (JSON.parse(auction.image))[0].url : ""}}
                                />
                                <View style={{marginHorizontal: 16}}>
                                    <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 15, color: '#1e1e1e', lineHeight: 24}}>{auction.name}</Text>
                                    <HTML
                                        style={{flex: 1}} source={{html: auction.auction_description || '<p></p>'}}
                                        ignoredStyles={["font-family", "letter-spacing"]}
                                />
                                </View>
                            </View>
                        </View>
                        <View style={{backgroundColor: 'white', paddingHorizontal: 16, paddingTop: 24, paddingBottom: 32, marginTop: 8}}>
                            <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 16, color: '#1e1e1e'}}>주문자 정보</Text>
                            <View style={[styles.flex_row, {marginTop: 20}]}>
                                <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 14, color: '#909090', width: 50}}>
                                    이름
                                    <Text style={{color: '#ee4442'}}>*</Text>
                                </Text>
                                <TextInput 
                                    placeholder={''}
                                    value={orderName}
                                    onChangeText={setOrderName}
                                    style={{height: 40, flex: 1, fontSize: 14, color: '#1e1e1e', marginLeft: 6, borderRadius: 2, borderColor: '#e0e0e0', borderWidth: 1, paddingHorizontal: 12}}
                                />
                            </View>
                            <View style={[styles.flex_row, {marginTop: 12}]}>
                                <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 14, color: '#909090', width: 50}}>
                                    휴대폰
                                    <Text style={{color: '#ee4442'}}>*</Text>
                                </Text>
                                <TextInputMask
                                    type={'custom'}
                                    options={{
                                        mask: '999-9999-9999'
                                    }}
                                    style={{height: 40, flex: 1, fontSize: 14, color: '#1e1e1e', marginLeft: 6, borderRadius: 2, borderColor: '#e0e0e0', borderWidth: 1, paddingHorizontal: 12}}
                                    placeholder={''}
                                    placeholderTextColor={'#909090'}
                                    autoCapitalize={'none'}
                                    value={orderPhone}
                                    onChangeText={(val) => {setOrderPhone(val.replace(/-/g, ''))}}
                                />
                                {/* <TextInput 
                                    placeholder={''}
                                    keyboardType={'number-pad'}
                                    value={countryCode}
                                    onChangeText={setCountryCode}
                                    style={{textAlign: 'center', height: 40, flex: 1, fontSize: 14, color: '#1e1e1e', marginLeft: 6, borderRadius: 2, borderColor: '#e0e0e0', borderWidth: 1, paddingHorizontal: 12}}
                                />
                                <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 14, color: '#909090', paddingHorizontal: 5}}>-</Text>
                                <TextInput 
                                    placeholder={''}
                                    keyboardType={'number-pad'}
                                    value={username}
                                    onChangeText={setUserName}
                                    style={{textAlign: 'center', height: 40, flex: 1, fontSize: 14, color: '#1e1e1e', borderRadius: 2, borderColor: '#e0e0e0', borderWidth: 1, paddingHorizontal: 12}}
                                />
                                <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 14, color: '#909090', paddingHorizontal: 5}}>-</Text>
                                <TextInput 
                                    placeholder={''}
                                    keyboardType={'number-pad'}
                                    value={username}
                                    onChangeText={setUserName}
                                    style={{textAlign: 'center', height: 40, flex: 1, fontSize: 14, color: '#1e1e1e', borderRadius: 2, borderColor: '#e0e0e0', borderWidth: 1, paddingHorizontal: 12}}
                                /> */}
                            </View>
                        </View>
                        <View style={{backgroundColor: 'white', paddingHorizontal: 16, paddingTop: 24, paddingBottom: 32, marginTop: 8}}>
                            <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 16, color: '#1e1e1e'}}>배송지 입력</Text>
                            <View style={[styles.flex_row, {marginTop: 21}]}>
                                <TouchableOpacity 
                                    style={[styles.flex_row]}
                                    onPress={() => {
                                        setSameOrder(!same_order)
                                    }}
                                >
                                    <Image
                                        style={{width: 20, height: 20}}
                                        width={20}
                                        height={20}
                                        source={
                                            same_order === true ? require('../../Assets/ic_select_on.png') : require('../../Assets/ic_select_off.png')
                                        }
                                    />
                                    <Text style={[{fontFamily: 'NotoSansCJKkr-Medium', color: '#1e1e1e', fontSize: 15, marginLeft: 4}]}>주문자 정보와 동일</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={[styles.flex_row, {marginLeft: 16}]}
                                    onPress={() => {
                                        setShipDest(!ship_dest)
                                    }}
                                >
                                    <Image
                                        style={{width: 20, height: 20}}
                                        width={20}
                                        height={20}
                                        source={
                                            ship_dest === true ? require('../../Assets/ic_select_on.png') : require('../../Assets/ic_select_off.png')
                                        }
                                    />
                                    <Text style={[{fontFamily: 'NotoSansCJKkr-Medium', color: '#1e1e1e', fontSize: 15, marginLeft: 4}]}>배송지 불러오기</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.flex_row, {marginTop: 20}]}>
                                <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 14, color: '#909090', width: 50}}>
                                    이름
                                    <Text style={{color: '#ee4442'}}>*</Text>
                                </Text>
                                <TextInput 
                                    placeholder={''}
                                    value={buyerName}
                                    onChangeText={setBuyerName}
                                    style={{height: 40, flex: 1, fontSize: 14, color: '#1e1e1e', marginLeft: 6, borderRadius: 2, borderColor: '#e0e0e0', borderWidth: 1, paddingHorizontal: 12}}
                                />
                            </View>
                            <View style={[styles.flex_row, {marginTop: 12}]}>
                                <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 14, color: '#909090', width: 50}}>
                                    휴대폰
                                    <Text style={{color: '#ee4442'}}>*</Text>
                                </Text>
                                <TextInputMask
                                    type={'custom'}
                                    options={{
                                        mask: '999-9999-9999'
                                    }}
                                    style={{height: 40, flex: 1, fontSize: 14, color: '#1e1e1e', marginLeft: 6, borderRadius: 2, borderColor: '#e0e0e0', borderWidth: 1, paddingHorizontal: 12}}
                                    placeholder={''}
                                    placeholderTextColor={'#909090'}
                                    autoCapitalize={'none'}
                                    value={buyerPhone}
                                    onChangeText={(val) => {setBuyerPhone(val.replace(/-/g, ''))}}
                                />
                            </View>
                            <View style={[styles.flex_row, {marginTop: 12}]}>
                                <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 14, color: '#909090', width: 50}}>
                                    주소
                                </Text>
                                <View
                                    style={{justifyContent: 'center', height: 40, flex: 1, marginLeft: 6, borderRadius: 2, borderColor: '#e0e0e0', borderWidth: 1, paddingHorizontal: 12, backgroundColor: '#f5f5f5'}}
                                >
                                    <Text 
                                        style={{fontSize: 14, color: '#1e1e1e'}}
                                    >
                                        {postCode}
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    style={[ styles.center, {height: 40, width: 112, backgroundColor: '#666666', color: 'white', borderRadius: 2, marginLeft: 8}]}
                                    onPress={()=>{navigation.push('DaumPostCodeScreen', {setCode: setPostCode, setAddress: setAddress})}}
                                >
                                    <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 14, color: '#ffffff'}}>우편번호 검색</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.flex_row, {marginTop: 12}]}>
                                <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 14, color: '#909090', width: 50}}>
                                </Text>
                                <View 
                                    style={{height: 40, flex: 1, justifyContent: 'center', marginLeft: 6, borderRadius: 2, borderColor: '#e0e0e0', borderWidth: 1, paddingHorizontal: 12, backgroundColor: '#f5f5f5'}}
                                >
                                    <Text
                                        style={{fontSize: 14, color: '#1e1e1e'}}
                                    >
                                        {address}
                                    </Text>
                                </View>
                            </View>
                            <View style={[styles.flex_row, {marginTop: 12}]}>
                                <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 14, color: '#909090', width: 50}}>
                                </Text>
                                <TextInput 
                                    placeholder={'상세 주소를 입력해 주세요.'}
                                    placeholderTextColor='#909090'
                                    value={buyerDetail}
                                    onChangeText={setBuyerDetail}
                                    style={{height: 40, flex: 1, fontSize: 14, color: '#1e1e1e', marginLeft: 6, borderRadius: 2, borderColor: '#e0e0e0', borderWidth: 1, paddingHorizontal: 12}}
                                />
                            </View>
                            <View style={[styles.flex_row, {marginTop: 12}]}>
                                <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 14, color: '#909090', width: 50}}>
                                </Text>
                                <TextInput 
                                    placeholder={'최대 50자까지 입력 가능합니다.'}
                                    placeholderTextColor='#909090'
                                    value={deliverMsg}
                                    onChangeText={setDeliverMsg}
                                    maxLength={150}
                                    underlineColor='transparent'
                                    underlineColorAndroid='transparent'
                                    multiline={true}
                                    style={{height: 80, flex: 1, fontSize: 14, color: '#1e1e1e', marginLeft: 6, borderRadius: 2, borderColor: '#e0e0e0', borderWidth: 1, paddingHorizontal: 12}}
                                />

                            </View>
                        </View>
                        <View style={{backgroundColor: 'white', paddingHorizontal: 16, paddingTop: 24, paddingBottom: 32, marginTop: 8}}>
                            <View style={[styles.flex_row, {justifyContent: 'space-between'}]}>
                                <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 16, color: '#1e1e1e'}}>할인 적용</Text>
                                <View style={styles.flex_row}>
                                    <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 14, color: '#555555'}}>
                                        할인 쿠폰
                                    </Text>
                                    <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 14, color: '#909090', paddingLeft: 4}}>
                                        {coupons ? coupons.length : 0}장
                                    </Text>
                                </View>
                            </View>
                            <View style={[styles.flex_row, {marginTop: 12}]}>
                                <TextInput 
                                    placeholder={'사용 가능한 쿠폰이 없습니다.'}
                                    placeholderTextColor='#909090'
                                    style={{height: 40, flex: 1, fontSize: 14, color: '#1e1e1e', borderRadius: 2, borderColor: '#e0e0e0', borderWidth: 1, paddingHorizontal: 12, backgroundColor: '#f5f5f5'}}
                                />
                                <TouchableOpacity
                                    style={[ styles.center, {height: 40, width: 112, backgroundColor: '#bababa', color: 'white', borderRadius: 2, marginLeft: 8}]}
                                    onPress={() => {showCouponSelection(true)}}
                                >
                                    <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 14, color: '#ffffff'}}>쿠폰 선택</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{backgroundColor: 'white', paddingHorizontal: 16, paddingTop: 24, paddingBottom: 32, marginTop: 8}}>
                            <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 16, color: '#1e1e1e'}}>결제 수단 선택</Text>
                            <View style={[styles.flex_row, {marginTop: 20, justifyContent: 'space-between'}]}>
                                <TouchableOpacity
                                    style={[ styles.center, {height: 56, flex: 1, backgroundColor: payMethod === 'card' ? '#04dea0' : '#ececec', borderRadius: 2, marginLeft: 8}]}
                                    onPress={() => setPayMethod('card')}
                                >
                                    <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 14, color: payMethod === 'card' ? '#ffffff' : '#555555'}}>신용카드</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[ styles.center, {height: 56, flex: 1, backgroundColor: payMethod === 'trans' ? '#04dea0' : '#ececec', borderRadius: 2, marginLeft: 12}]}
                                    onPress={() => setPayMethod('trans')}
                                >
                                    <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 14, color: payMethod === 'trans' ? '#ffffff' : '#555555'}}>계좌이체</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{backgroundColor: 'white', paddingHorizontal: 16, paddingTop: 24, paddingBottom: 32, marginTop: 8}}>
                            <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 16, color: '#1e1e1e'}}>총 결제금액</Text>
                            <View style={[styles.flex_row, {justifyContent: 'space-between', marginTop: 20}]}>
                                <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 14, color: '#555555'}}>상품 금액</Text>
                                <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 15, color: '#1e1e1e'}}>
                                    {auction.biddings[0].bidding_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원
                                </Text>
                            </View>
                            <View style={[styles.flex_row, {justifyContent: 'space-between', marginTop: 10}]}>
                                <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 14, color: '#555555'}}>배송비</Text>
                                <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 15, color: '#04dea0'}}>+{fee.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원</Text>
                            </View>
                            <View style={[styles.flex_row, {justifyContent: 'space-between', marginTop: 10}]}>
                                <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 14, color: '#555555'}}>할인쿠폰</Text>
                                <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 15, color: '#ee4442'}}>-0원</Text>
                            </View>
                            <View style={{width: '100%', height: 1, backgroundColor: '#ececec', marginTop: 20}}/>
                            <View style={[styles.flex_row, {justifyContent: 'space-between', marginTop: 20}]}>
                                <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 14, color: '#555555'}}>총 결제 금액</Text>
                                <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 24, color: '#1e1e1e'}}>
                                    {(auction.biddings[0].bidding_price+fee).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원
                                </Text>
                            </View>
                        </View>
                        <View style={{backgroundColor: 'white', paddingHorizontal: 16, paddingTop: 24, paddingBottom: 32, marginTop: 8, backgroundColor: '#f5f5f5'}}>
                            <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 16, color: '#1e1e1e'}}>결제 동의</Text>
                            <TouchableOpacity 
                                style={[styles.flex_row, {marginTop: 20, alignItems: 'flex-start'}]}
                                onPress={() => {
                                    setShipDest(!ship_dest)
                                }}
                            >
                                <Image
                                    style={{width: 20, height: 20}}
                                    width={20}
                                    height={20}
                                    source={
                                        ship_dest === true ? require('../../Assets/ic_select_on.png') : require('../../Assets/ic_select_off.png')
                                    }
                                />
                                <Text style={[{fontFamily: 'NotoSansCJKkr-Regular', color: '#888888', fontSize: 14, marginLeft: 8, flex: 1, lineHeight: 24}]}>
                                    상품의 상품정보, 가격, 배송정보, 할인내역 등을 모두 확인하였으며, 구매에 동의합니다.(전자상거래법 8조2항)
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.flex_row, {marginTop: 12, alignItems: 'flex-start'}]}
                                onPress={() => {
                                    setShipDest(!ship_dest)
                                }}
                            >
                                <Image
                                    style={{width: 20, height: 20}}
                                    width={20}
                                    height={20}
                                    source={
                                        ship_dest === true ? require('../../Assets/ic_select_on.png') : require('../../Assets/ic_select_off.png')
                                    }
                                />
                                <Text style={[{fontFamily: 'NotoSansCJKkr-Regular', color: '#888888', fontSize: 14, marginLeft: 8, flex: 1, lineHeight: 24}]}>
                                    거래방식 및 취급상품의 특성상 구매하기 이후 교환 및 환불이 불가능함을 인지하였으며, 이에 동의합니다.
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </KeyboardAwareScrollView>
                    <TouchableOpacity 
                        style={[styles.center, {height: 64, backgroundColor: '#bababa'}]}
                        onPress={()=>{}}
                    >
                        <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 18, color: '#ffffff'}}>
                            {(auction.biddings[0].bidding_price+fee).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원 결제하기
                        </Text>
                    </TouchableOpacity>
                </SafeAreaView>
                <CouponSelectModal
                    price={auction.biddings[0].bidding_price+fee}
                    coupons={coupons}
                    setCoupons={setCoupons}
                    okAction={() => {}}
                    dismissAction={()=>{showCouponSelection(false)}}
                />
            </View>
        )
    }
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
        user: state.global.user,
    }
}

const mapDispatchToProps = {
    setApiLoading,
    showAlert,
    showCouponSelection
}

export default connect(
    mapStateToProps, 
    mapDispatchToProps
)(WinBidPayScreen);
