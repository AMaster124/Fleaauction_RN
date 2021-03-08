import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';

import { 
    StyleSheet, 
    View,
    Image,
    Text,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'

const RewardOpenAlert = (props) => {

    const donations_dummy = [
        {name: '수도건설비', price: 320000},
        {name: '식량구축비 ', price: 237000},
        {name: '도서제공비', price: 20000},
    ]

    const {rewards, confirnAction, dismissAction} = props
    const [totalPrice, setTotalPrice] = useState(0)
    const [donations, setDonations] = useState(null)
    const [maxBarLength, setMaxBarLength] = useState(0)

    const _renderReward = (item, key) => {
        let rewardIcon
        let rewardName

        if(item.category_id === 1) {
            rewardIcon = require('../../Assets/reward_1.png')
            rewardName = 'FleaAuction Goods'
        } else if(item.category_id === 2) {
            rewardIcon = require('../../Assets/reward_2.png')
            rewardName = 'Auction Cash'
        } else  {       // if(item.category_id === 3) {
            rewardIcon = require('../../Assets/reward_3.png')
            rewardName = 'Donation Badge'
        }

        return (
            <View key={key} style={{paddingRight: 16, alignItems: 'center'}}>
                <Image
                    style={{width: 96, height: 96}}
                    width={96}
                    height={96}
                    source={rewardIcon}
                />
                <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 16, color: '#757269', lineHeight: 32, marginTop: 8}}>{rewardName}</Text>
            </View>
        )
    }

    return (
        <View style={[styles.container, styles.center]}>
            <View style={{marginHorizontal: 16, backgroundColor: '#fef7ec', paddingTop: 32, paddingBottom: 24, alignSelf: 'stretch', borderRadius: 16, borderWidth: 8, borderColor: '#17a47c', overflow: 'hidden'}}>
                <View style={{paddingHorizontal: 16, alignItems: 'center'}}>
                    <Text style={{fontFamily: 'NotoSansCJKkr-Bold', fontSize: 24, color: '#757269', lineHeight: 32}}>획득했습니다!</Text>
                    
                    <ScrollView
                        style={{paddingVertical: 32}}
                        horizontal={true}
                    >
                        {
                            rewards && rewards.map((item, key) => {
                                return _renderReward(item, key)
                            })
                        }
                    </ScrollView>
                </View>
                
                <TouchableOpacity 
                    style={[styles.center, {height: 56, marginHorizontal: 16, borderRadius: 200, backgroundColor: '#04dea0'}]}
                    onPress={()=>{
                        confirnAction()
                        dismissAction()
                    }}
                >
                    <Text style={{fontFamily: 'NotoSansCJKkr-Bold', fontSize: 18, color: '#ffffff'}}>확인</Text>
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
    header_right: {
        position: 'absolute',
        top: 0,
        right: 0,
        height: '100%',
        padding: 16
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
)(RewardOpenAlert);
