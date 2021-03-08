import React, {useState} from 'react';
import {connect} from 'react-redux';

import { 
    StyleSheet, 
    View,
    Image,
    Text
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const LiveAuctionPayGuideAlert = (props) => {
    const {confirnAction, dismissAction} = props
    return (
        <View style={[styles.container, styles.center]}>
            <View style={{marginHorizontal: 24, backgroundColor: '#FFFFFF', paddingTop: 24, alignSelf: 'stretch', borderRadius: 4, overflow: 'hidden'}}>
                <View style={{paddingHorizontal: 24, alignItems: 'center'}}>
                    <Image
                        style={{width: 72, height: 72}}
                        width={72}
                        height={72}
                        source={require('../../Assets/ic_pay.png')}
                    />
                    <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 20, color: '#1e1e1e', marginTop: 12, lineHeight: 28, textAlign: 'center'}}>{`낙찰금 결제 안내`}</Text>
                    <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 14, color: '#1e1e1e', marginTop: 4, lineHeight: 24, textAlign: 'center'}}>{`아래 항목을 모두 확인해주세요.`}</Text>
                </View>
                <View style={{backgroundColor: '#ececec', paddingHorizontal: 16, paddingVertical: 20}}>
                    <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 14, color: '#1e1e1e', lineHeight: 24}}>{`1. 배송비(3,000원) 부과 안내`}</Text>
                    <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 12, color: '#666666', marginTop: 2, lineHeight: 18}}>{`모든 제품은 배송비 3,000원이 별도로 부과됩니다.`}</Text>
                    <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 14, color: '#1e1e1e', lineHeight: 24, marginTop: 12}}>{`2. 상품 하자에 대한 안내`}</Text>
                    <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 12, color: '#666666', marginTop: 2, lineHeight: 18}}>{`사용감이 있는 중고품인 경우, 상품 하자로 분류되지 않습니다.`}</Text>
                    <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 14, color: '#1e1e1e', lineHeight: 24, marginTop: 12}}>{`3. 교환/환불 불가능`}</Text>
                    <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 12, color: '#666666', marginTop: 2, lineHeight: 18}}>{`온라인 경매 약관에 의거하여 결제 이후 교환 및 환불이 불가능하나, 상품 보증 위반의 경우 절차에 따라 즉각 환불됩니다.`}</Text>
                    <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 14, color: '#1e1e1e', lineHeight: 24, marginTop: 12}}>{`4. 결제금액 기부 안내`}</Text>
                    <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 12, color: '#666666', marginTop: 2, lineHeight: 18}}>{`경매 운영 수수료를 제외한 낙찰대금 전액은 기부됩니다. 기부금 영수증 발행은 주민등록번호 수집이 완료된 후 가능하오니 결제 이후, 주민등록번호 등록을 부탁드립니다.`}</Text>
                </View>
                <View style={[styles.flex_row, {height: 56}]}>
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
)(LiveAuctionPayGuideAlert);
