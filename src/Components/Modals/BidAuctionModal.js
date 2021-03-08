import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Image, LogBox, TextInput } from "react-native"
import {connect} from 'react-redux';
import { TouchableHighlight, TouchableOpacity } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';

let height = 335

const BidAuctionModal = (props) => {
    const {navigation, isOpen, initPrice, unit, okAction, dismissAction} = props

    const [show, setShow] = useState(false)
    const [bottomHeight] = useState(new Animated.Value(0))
    const [price, setPrice] = useState(0)
    const [offset, setOffset] = useState(0)

    LogBox.ignoreLogs(['Animated: `useNativeDriver`'])

    useEffect(()=>{
        if(isOpen) {
            setShow(true)
            setPrice(initPrice)
            setOffset(0)
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

    const _okHandler = () => {
        okAction(price+offset);
        dismissAction();
    }

    if( show ) {
        // const height = 400*bgOpacity/0.5
        return (
            <View style={styles.container}>
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
                        <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 18, color: '#1e1e1e'}}>입찰하기</Text>
                    </View>
                    <View style={[{flex: 1, paddingHorizontal: 16, justifyContent: 'center'}]}>
                        <View style={[styles.flex_row, {justifyContent: 'space-between'}]}>
                            <View style={[styles.flex_row]}>
                                <TouchableOpacity 
                                    style={[styles.center, {width: 40, height: 44, backgroundColor: '#f5f5f5', borderTopLeftRadius: 2, borderBottomLeftRadius: 2, borderWidth: 1, borderColor: '#e0e0e0'}]}
                                    onPress={()=>{setOffset(offset-unit)}}
                                >
                                    <AntDesign name={'minus'} size={16} color={'#1e1e1e'}/>
                                </TouchableOpacity>
                                <View style={[styles.center, {height: 44}]}>
                                    <View style={{position: 'absolute', top: 0, left: 0, right: 0, height: 1, backgroundColor: '#e0e0e0'}}/>
                                    <TextInput
                                        style={{paddingHorizontal: 18}}
                                        keyboardType={'number-pad'}
                                        value={offset.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        onChangeText={(text) => {setOffset(parseInt(text.replace(',', '')))}}
                                    />
                                    <View style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, backgroundColor: '#e0e0e0'}}/>
                                </View>
                                <TouchableOpacity 
                                    style={[styles.center, {width: 40, height: 44, backgroundColor: '#f5f5f5', borderTopRightRadius: 2, borderBottomRightRadius: 2, borderWidth: 1, borderColor: '#e0e0e0'}]}
                                    onPress={()=>{setOffset(offset+unit)}}
                                >
                                    <AntDesign name={'plus'} size={16} color={'#1e1e1e'}/>
                                </TouchableOpacity>
                            </View>
                            <View style={{alignItems: 'flex-end'}}>
                                <View style={[styles.flex_row]}>
                                    <View style={{height: 20, justifyContent: 'center', paddingHorizontal: 5, backgroundColor: '#ececec', borderRadius: 2}}>
                                        <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 11, color: '#666666'}}>시작가</Text>
                                    </View>
                                    <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 14, color: '#555555', marginLeft: 6}}>
                                        {initPrice && initPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원
                                    </Text>
                                </View>
                                <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 14, color: '#04dea0', marginLeft: 6, lineHeight: 24}}>
                                    {offset > 0 ? '+' : ''}{offset.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원
                                </Text>
                            </View>
                        </View>
                        <View style={{height: 1, backgroundColor: '#ececec', marginVertical: 22}}/>
                        <View style={[styles.flex_row, {justifyContent: 'space-between'}]}>
                            <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 14, color: '#555555'}}>입찰 신청가</Text>
                            <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 24, color: '#1e1e1e'}}>
                                {(price+offset).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                <Text style={{fontSize: 16}}> 원</Text>
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity 
                        style={[styles.center, {marginHorizontal: 16, marginVertical: 24, height: 56, borderRadius: 4, backgroundColor: '#04dea0'}]}
                        onPress={_okHandler}
                    >
                        <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 16, color: '#ffffff'}}>입찰 신청</Text>
                    </TouchableOpacity>
                </Animated.View>
        </View>
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
        bottom: 0,
        display: 'flex'
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
        height: 48,
        borderRadius: 4,
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        paddingHorizontal: 16,
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
        isOpen: state.modal.showBid,
        initPrice: state.modal.bidPrice,
        unit: state.modal.bidUnit,
    }
}

const mapDispatchToProps = {
}

export default connect(
    mapStateToProps, 
    mapDispatchToProps
)(BidAuctionModal);
