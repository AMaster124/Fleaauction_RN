import React, {useState} from 'react';
import {connect} from 'react-redux';

import { 
    StyleSheet, 
    View,
    Image,
    Text
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const LiveAuctionBidAlert = (props) => {
    const {confirnAction, dismissAction} = props
    return (
        <View style={[styles.container, styles.center]}>
            <View style={{marginHorizontal: 24, backgroundColor: '#FFFFFF', paddingTop: 36, alignSelf: 'stretch', borderRadius: 4, overflow: 'hidden'}}>
                <View style={{paddingHorizontal: 24}}>
                    <Image
                        style={{width: 72, height: 72}}
                        width={72}
                        height={72}
                        source={require('../../Assets/ic_notice.png')}
                    />
                    <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 20, color: '#1e1e1e', marginTop: 20, lineHeight: 28}}>{`먼저 응찰하신 분께\n우선 순위가 주어집니다`}</Text>
                    <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 14, color: '#1e1e1e', marginTop: 16, lineHeight: 24}}>{`동일한 금액의 응찰이 발생할 경우\n서버시간에 따라 먼저 입찰금액을\n입력하신 분에게 우선 순위가 주어집니다.`}</Text>
                    <View style={{height: 1, backgroundColor: '#ececec', marginVertical: 24}}/>
                    <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 14, color: '#ee4442', lineHeight: 24}}>{`응찰 및 낙찰 후 취소가 불가능 하오니,\n응찰전 신중히 선택하시기 바랍니다.`}</Text>
                </View>
                
                <View style={[styles.flex_row, {height: 56, marginTop: 30}]}>
                    <View style={{flex: 1, backgroundColor: '#bababa'}}>
                        <TouchableOpacity 
                            style={[styles.center, {height: 56}]}
                            onPress={dismissAction}
                        >
                            <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 16, color: '#ffffff'}}>취소</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{flex: 2, backgroundColor: '#04dea0'}}>
                        <TouchableOpacity 
                            style={[styles.center, {height: 56}]}
                            onPress={()=>{
                                confirnAction()
                                dismissAction()
                            }}
                        >
                            <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 16, color: '#ffffff'}}>확인</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#000000CC",
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
}

export default connect(
    mapStateToProps, 
    mapDispatchToProps
)(LiveAuctionBidAlert);
