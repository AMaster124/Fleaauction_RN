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
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'
import moment from 'moment';

import {setApiLoading} from '../../Redux/action/globalAction'
import {showAlert} from '../../Redux/action/AlertAction'
import APIKit from '../../Config/APIKit';

const BidHistoryScreen = (props) => {
    const {navigation, setApiLoading, showAlert} = props

    const auctions_dummy = [
        {date: '10.24(토)', name: '데이브레이크 베이지 형광', price: 5000, endAuction: false, img: 'https://openimage.interpark.com/goods_image_big/0/2/0/7/7043100207b_l.png'},
        {date: '10.20(화)', name: '필름 카메라', price: 1500000, endAuction: false, img: 'https://img.maisonkorea.com/2020/03/msk_5e7d5de1f1e16.jpg'},
        {date: '10.20(화)', name: '애플 맥북프로 16형 MVVK2H/A 스…', price: 5000, endAuction: true, img: 'https://mblogthumb-phinf.pstatic.net/MjAyMDAyMDdfNyAg/MDAxNTgxMDQ1OTU2MjE3.I7QbO-7ATDj9cwqJEmGKlXeFvwk_c1cOWdTdqm888_Mg.n6vnAj9m4asdkmrlXhulDofrqs9WTTuaQIdKAmuVapgg.JPEG.hsy58x/IMG_8371.jpg?type=w800'},
        {date: '10.19(월)', name: 'Tasaki 다이아몬드 반지', price: 5000, endAuction: false, img: 'https://www.iwedding.co.kr/center/pic/plaza_post/data/32183783_AVSOw7Mi_K-30.jpg'},
    ]

    const [filterDir, setFilterDir] = useState(true)
    const [dateKeys, setDateKeys] = useState(null)
    const [groupAuctions, setGroupAuctions] = useState(null)
    const [totalCnt, setTotalCnt] = useState(0)

    useEffect(() => {
        loadBidAuctions()
    }, [])
    
    const loadBidAuctions = () => {
        setApiLoading(true)
        APIKit.post('users/get-bidding-list')
        .then( (res) => {
            setApiLoading(false)
            const data = res.data
            if(!data) {
                return
            }

            const status = data.status
            if(status === true) {
                groupingAuctions(data.results.list)
            } else {
                showAlert({message: data.msg})
            }
        })
        .catch(error => {
            setApiLoading(false)
            console.log('users/get-bidding-list', error.message)
        })
    }

    const groupingAuctions = (auction_list) => {
        let groupAuctions = []
        let keys = []
        for(i = 0; i < auction_list.length; i++) {
            const item = auction_list[i]
            const date = moment(item.auction.registered_date).format('MM.DD일(dd)')
            if(!groupAuctions[date]) {
                groupAuctions[date] = []
                keys.push(date)
            }

            groupAuctions[date] = [...groupAuctions[date], item]
        }

        setTotalCnt(auction_list.length)
        sortKeys(keys, filterDir)
        setGroupAuctions(groupAuctions)
    }

    const sortKeys = (keys, dir) => {
        const sortKeys = keys.sort((a, b) => {
            if(dir === true) {
                return a > b ? 1 : -1
            } else {
                return a < b ? 1 : -1
            }
        })

        setDateKeys(sortKeys)
    }

    const _renderAuctionItem = (item, key) => {
        let end_date = item.auction.all_finish_date
        end_date = moment(end_date)
        const now = moment()
        const close = now.diff(end_date, 'seconds') > 0

        let images = item.auction.image
        if(images) {
            images = JSON.parse(images)
        }

        return (
            <TouchableOpacity
                key={key}
                style={[{paddingHorizontal: 8, paddingVertical: 12, flexDirection: 'row'}]}
                onPress={() => {
                    if(item.auction.role === 'live') {
                        navigation.push('LiveAuctionScreen', {id: item.auction_id})
                    } else {
                        navigation.push('MultiAuctionScreen', {id: item.auction_id})
                    }
                }}
            >
                <View style={{width: 88, height: 88, borderRadius: 4, overflow: 'hidden'}}>
                    <Image
                        style={{width: 88, height: 88, borderRadius: 4}}
                        width={88}
                        height={88}
                        source={{uri: images[0].url}}
                    />
                    {
                        close === true ?
                            <View style={[styles.center, {position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#00000080'}]}>
                                <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 15, color: '#ffffff'}}>경매완료</Text>
                            </View>
                        : null
                    }
                </View>
                
                <View style={{marginLeft: 12, marginTop: 2}}>
                    <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 14, color: '#1e1e1e', lineHeight: 24}}>{item.auction.name}</Text>
                    <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 16, color: '#1e1e1e', marginTop: 4, lineHeight: 24}}>
                        {item.bidding_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원
                    </Text>
                </View>
            </TouchableOpacity>
        )
    }

    const _renderAuctionSection = (item, key) => {
        return (
            <View key={key} style={{paddingHorizontal: 16, marginTop: 16}}>
                <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 14, color: '#1e1e1e', lineHeight: 24}}>{item}</Text>
                { 
                    groupAuctions && groupAuctions[item] && groupAuctions[item].map((item, key) => {
                        return _renderAuctionItem(item, key)
                    })

                }
                <View style={{height: 1, backgroundColor: '#ececec', marginTop: 12}}/>
            </View>
        )
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
                    <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 18, color: '#1e1e1e'}}>응찰목록</Text>
                </View>
                <View style={{height: 1, backgroundColor: '#ececec'}}/>
                <View style={[styles.flex_row, {height: 40, backgroundColor: '#f5f5f5', justifyContent: 'space-between', paddingHorizontal: 16}]}>
                    <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 14, color: '#1e1e1e'}}>전체({totalCnt}개)</Text>
                    <TouchableOpacity
                        style={styles.flex_row}
                        onPress={()=>{
                            setFilterDir(!filterDir)
                            sortKeys(dateKeys, !filterDir)
                        }}
                    >
                        <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 12, color: '#1e1e1e', marginRight: 4}}>최근순</Text>
                        <Ionicons
                            size={20}
                            color={'#888888'}
                            name={filterDir === true ? 'chevron-up' : 'chevron-down'}
                        />
                    </TouchableOpacity>
                </View>
                <View style={{height: 1, backgroundColor: '#ececec'}}/>
                <ScrollView style={{flex: 1}}>
                { dateKeys && dateKeys.map((item, key) => {
                    return _renderAuctionSection(item, key)
                })
                    
                }
                </ScrollView>
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
    }
}

const mapDispatchToProps = {
    setApiLoading,
    showAlert
}

export default connect(
    mapStateToProps, 
    mapDispatchToProps
)(BidHistoryScreen);
