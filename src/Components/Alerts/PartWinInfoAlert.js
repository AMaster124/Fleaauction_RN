import React, {useState} from 'react';
import {connect} from 'react-redux';

import { 
    StyleSheet, 
    View,
    Image,
    Text
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const PartWinInfoAlert = (props) => {
    const {confirnAction, dismissAction} = props
    return (
        <View style={[styles.container, styles.center]}>
            <View style={{marginHorizontal: 24, backgroundColor: '#FFFFFF', paddingTop: 24, alignSelf: 'stretch', borderRadius: 4, overflow: 'hidden'}}>
                <View style={{paddingHorizontal: 24, alignItems: 'center'}}>
                    <Image
                        style={{width: 56, height: 56, alignSelf: 'center'}}
                        width={56}
                        height={56}
                        source={require('../../Assets/ic_bulb.png')}
                    />
                    <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 15, color: '#1e1e1e', textAlign: 'center', marginTop: 16}}>
                        {`부분 낙찰이란,\n해당 가격에 동일하게 입찰한 사용자 중\n선착순으로 제한된 수량 범위까지\n낙찰이 됩니다`}
                    </Text>
                </View>
                <TouchableOpacity 
                    style={[styles.center, {height: 56, backgroundColor: '#04dea0', marginTop: 24}]}
                    onPress={()=>{
                        confirnAction()
                        dismissAction()
                    }}
                >
                    <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 16, color: '#ffffff'}}>확인</Text>
                </TouchableOpacity>
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
)(PartWinInfoAlert);
