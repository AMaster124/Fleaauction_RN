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
    ScrollView
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'
import PartWinInfoAlert from '../../Components/Alerts/PartWinInfoAlert';

const AuctionResultScreen = (props) => {
    const {navigation} = props

    const [results, setResults] = useState(null)
    const [partWinInfo, setPartWinInfo] = useState(false)

    useEffect(() => {
        if(navigation.state.params.bidding) {
            const sorted = navigation.state.params.bidding.sort((a, b) => {
                if(a.bid.bidding_price === b.bid.bidding_price) {
                    if(a.bid.state === '3') {
                        return -1
                    }
                    if(b.bid.state === '3') {
                        return 1
                    }
                    
                }
                return a.bid.bidding_price < b.bid.bidding_price ? 1 : -1
            })
            
            setResults(sorted)
        }
    }, [])

    const _renderResultWinCell = (item, key) => {
        return(
            <View key={key} style={[styles.flex_row, ]}>
                <Image
                    style={{width: 24, height: 24}}
                    width={24}
                    height={24}
                    source={require('../../Assets/ic_emoji_smile.png')}
                />
                <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 14, color: '#1e1e1e', marginLeft: 8}}>
                    낙찰
                </Text>
            </View>
        )
    }

    const _renderResultFailureCell = (item, key) => {
        return(
            <View key={key} style={[styles.flex_row, ]}>
                <Image
                    style={{width: 24, height: 24}}
                    width={24}
                    height={24}
                    source={require('../../Assets/ic_emoji_crying.png')}
                />
                <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 14, color: '#1e1e1e', marginLeft: 8}}>
                    유찰
                </Text>
            </View>
        )
    }

    const _renderResultPartWinCell = (item, key) => {
        return(
            <View key={key} style={{alignItems: 'center'}}>
                <View style={[styles.flex_row, ]}>
                    <Image
                        style={{width: 24, height: 24}}
                        width={24}
                        height={24}
                        source={require('../../Assets/ic_emoji_cool.png')}
                    />
                    <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 14, color: '#1e1e1e', marginLeft: 8}}>
                        부분낙찰
                    </Text>
                    <TouchableOpacity 
                        style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 14, color: '#1e1e1e', marginLeft: 2}}
                        onPress={()=>{setPartWinInfo(true)}}
                    >
                        <Image
                            style={{width: 20, height: 20}}
                            width={24}
                            height={24}
                            source={require('../../Assets/ic_q.png')}
                        />
                    </TouchableOpacity>
                </View>
                <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 11, color: '#666666', marginLeft: 8}}>
                    (선착순)
                </Text>
            </View>
        )
    }

    const _renderResultItem = (item, key) => {
        console.log(item)
        return (
            <View key={key} style={[styles.flex_row, {height: 52, backgroundColor: key%2 === 0 ? '#ffffff' : '#f5f5f5'}]}>
                <View style={[styles.center, {flex: 3}]}>
                    <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 14, color: '#1e1e1e'}}>
                        {item.bid.bidding_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원
                        <Text style={{fontFamily: 'NotoSansCJKkr-Regular', color: '#555555'}}>
                            {` (${item.num})`}
                        </Text>
                    </Text>
                </View>
                <View style={{width: 1, height: '100%', backgroundColor: '#ececec'}}/>
                <View style={[styles.center, {flex: 2}]}>
                    <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 14, color: '#1e1e1e'}}>
                    {
                        item.bid.state === '2' ? _renderResultWinCell()
                        : item.bid.state === '6' ? _renderResultFailureCell()
                        : _renderResultPartWinCell()
                    }
                    </Text>
                </View>
            </View>
        )
    }
    return (
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
                    <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 18, color: '#1e1e1e'}}>입찰결과</Text>
                </View>
                <View style={[styles.flex_row, {height: 40, backgroundColor: '#1e1e1e'}]}>
                    <View style={[styles.center, {flex: 3}]}>
                        <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 14, color: '#ffffff'}}>입찰가격 (입찰인원)</Text>
                    </View>
                    <View style={{width: 1, height: '100%', backgroundColor: '#666666'}}/>
                    <View style={[styles.center, {flex: 2}]}>
                        <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 14, color: '#ffffff'}}>결과</Text>
                    </View>
                </View>
                <ScrollView style={{flex: 1}}>
                {
                    results && results.map((item, key) => {
                        return _renderResultItem(item, key)
                    })
                }
                </ScrollView>
           </SafeAreaView>
           {
                partWinInfo === true ? (
                    <PartWinInfoAlert
                        confirnAction={()=>{}}
                        dismissAction={()=>setPartWinInfo(false)}
                    />
                ) : null
            }
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
    }
}

const mapDispatchToProps = {
}

export default connect(
    mapStateToProps, 
    mapDispatchToProps
)(AuctionResultScreen);
