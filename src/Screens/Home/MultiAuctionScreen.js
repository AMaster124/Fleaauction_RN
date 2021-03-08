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
    Dimensions, 
    ScrollView,
    Animated,
    Linking
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'
import LinearGradient from 'react-native-linear-gradient';
import VideoPlayer from 'react-native-video-player'
import HTML from 'react-native-render-html'
import moment from 'moment';

import {showInputBid} from '../../Redux/action/ModalAction'

import BidAuctionModal from '../../Components/Modals/BidAuctionModal';
import LiveAuctionBidAlert from '../../Components/Alerts/LiveAuctionBidAlert';
import LiveAuctionPayAlert from '../../Components/Alerts/LiveAuctionPayAlert';
import LiveAuctionPayGuideAlert from '../../Components/Alerts/LiveAuctionPayGuideAlert';
// import VideoThumbnail from 'react-native-video-thumbnail';
import { createThumbnail } from 'react-native-create-thumbnail'

import {setApiLoading} from '../../Redux/action/globalAction'
import {showAlert} from '../../Redux/action/AlertAction'
import APIKit from '../../Config/APIKit';

let timer = null
let finish_date = null

const MultiAuctionScreen = (props) => {
    const {navigation, setApiLoading, showAlert, showInputBid, user} = props

    const [like, setLike] = useState(false)
    const [ruleTab, setRuleTab] = useState(0)

    const [auctionId, setAuctionId] = useState(null)
    const [auction, setAuction] = useState(null)
    const [scrollY, setScrollY] = useState(new Animated.Value(0))

    const [thumbnail, setThumbnail] = useState(null)

    const [payAlert, setPayAlert] = useState(false)
    const [didPay, setDidPay] = useState(false)
    const [bidAlert, setBidAlert] = useState(false)
    const [bidPrice, setBidPrice] = useState(0)

    const [isOpen, setIsOpen] = useState(false)
    const [isClose, setIsClose] = useState(false)
    const [remainSeconds, setRemainSeconds] = useState(null)

    useEffect(() => {
        const id = navigation.state.params.id
        if(id !== undefined && id !== null) {
            setAuctionId(id)
            loadAuction(id)
        }
    }, [])
    
    useEffect(() => {
        if(isOpen === true) {
            startTimer()
        } else {
            stopTimer()
        }
    }, [isOpen])

    useEffect(() => {
        if(isClose === true) {
            setIsOpen(false)
            // stopTimer()
        }
    }, [isClose])

    const loadAuction = (id) => {
        setApiLoading(true)
        APIKit.post('auctions/get-one', {id: id})
        .then( (res) => {
            setApiLoading(false)
            const data = res.data
            if(!data) {
                return
            }
    
            const results = data.results
            let image = results.image
            if(image !== null) {
                image = JSON.parse(image)
            }
            setAuction({...results, bid: data.bid, bidding: data.bidding, image})
            setLike(data.like_state)
            checkOpen(results)
            getThumbnail(results.auction_video)
            finish_date = data.results.all_finish_date
        })
        .catch(error => {
            if(error.message === 'Network Error') {
                setTimeout(() => {loadAuction(id)}, 500)
            } else {
                setApiLoading(false)
                console.log('auctions/get-one', error.message)
            }
        })
    
    }
    
    const likeAuction = () => {
        setApiLoading(true)
        APIKit.post('auctions/like', {auction_id: auctionId})
        .then( (res) => {
            setApiLoading(false)
            const data = res.data
            if(!data) {
                return
            }

            setLike(data.status)
        })
        .catch(error => {
            setApiLoading(false)
            console.log('auctions/get-one', error.message)
        })
    }

    const getThumbnail = (videoUrl) => {
        createThumbnail({
            url: videoUrl,
            timeStamp: 10000,
        })
            .then(response => {
                setThumbnail(response.path)
            })
            .catch(err => console.log({err}))

        // if(videoUrl === null || videoUrl === undefined) {
        //     return
        // }

        // VideoThumbnail.get(videoUrl)
        // .then((res) => {
        //     setThumbnail(res.data)
        // })
        // .catch((err) => {
        //     console.log(err);
        // });
    }

    const startTimer = () => {
        stopTimer()
        const seconds = getRemainSeconds()
        if(seconds > 0) {
            setRemainSeconds(seconds)
            timer = setTimeout(startTimer, 300)
        } else {
            setIsClose(true)
        }
    }

    const stopTimer = () => {
        if(timer !== null) {
            clearTimeout(timer)
        }
    }

    const padStart = (val) => {
        const pad = (val < 10) ? '0' : ''
        return `${pad}${val}`
    }

    const getRemainSeconds = () => {
        if(finish_date === null) {
            return 0
        }

        const end_date = moment(finish_date)
        const now = moment()
        const diff = end_date.diff(now, 'seconds')
        return diff
    }

    const getRemainString = (seconds) => {
        if(seconds <= 0) {
            setIsClose(true)
            return ""
        } else {
            var remain = `${padStart(Math.floor(seconds/3600))}:${padStart(Math.floor(seconds/60)%60)}:${padStart(seconds%60)}`
            return remain
        }
    }

    const checkOpen = (auction) => {
        if(!auction || !auction.start_date) {
            return false
        }

        let start_date = auction.start_date ? auction.start_date : auction.registered_date
        start_date = moment(start_date)
        const now = moment()
        let open = now.diff(start_date, 'seconds') > 0
        if(open === true) {
            open = !checkClose(auction)
        }

        setIsOpen(open)
        return open
    }

    const checkClose = (auction) => {
        if(!auction || !auction.all_finish_date) {
            return false
        }

        let end_date = auction.all_finish_date ? auction.all_finish_date : auction.ended_date
        end_date = moment(end_date)
        const now = moment()
        const close = now.diff(end_date, 'seconds') > 0
        setIsClose(close)

        return close
    }

    const itemW = Dimensions.get('window').width
    const _renderAuctionImage = (item, key) => {
        return (
            <View key={key} style={[{height: itemW, width: itemW}]}>
                <Image
                    style={[{height: itemW, width: itemW}]}
                    width={itemW}
                    height={itemW}
                    resizeMode={'cover'}
                    source={{uri: item.url}}
                />
                <LinearGradient
                    colors={['#00000000', '#00000099']}
                    start={{x: 0.0, y: 0}}
                    end={{x: 0.0, y: 1}}
                    style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}
                />

            </View>
        )
    }

    const onPressBidConfirm = () => {
        setApiLoading(true)
        APIKit.post('auctions/bid', {auction_id: auctionId, price: bidPrice})
        .then( (res) => {
            setApiLoading(false)
            const data = res.data
            if(!data) {
                return
            }

            if(data.status === true) {
                loadAuction(auctionId)
            } else {
                showAlert({message: data.msg[0]})
            }
        })
        .catch(error => {
            setApiLoading(false)
            console.log('auctions/bid', error.message)
        })
    }

    const onPressPayConfirm = () => {
        navigation.push('WinBidPayScreen', {auction_id: auction.id})
    }

    const onPressBidHistory = () => {
        navigation.push('AuctionResultScreen', {bidding: auction.bidding})
    }

    const headerOpacity = scrollY.interpolate({
        inputRange: [itemW-56, itemW-30],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    })

    const headerPosition = scrollY.interpolate({
        inputRange: [itemW-30, itemW-28],
        outputRange: [0, -100],
        extrapolate: 'clamp',
    })

    return (
        auction === null ? null :
        <SafeAreaView style={[styles.container]}>
            <StatusBar barStyle="dark-content" />
            <View style={{flex: 1, backgroundColor: '#ececec'}}>
                <Animated.ScrollView 
                    style={{flex: 1}}
                    scrollEventThrottle={16}
                    onScroll={Animated.event(
                        [{nativeEvent: {contentOffset: {y: scrollY}}}],
                        {useNativeDriver: true}
                    )}
                >
                    <View style={{height: Dimensions.get('window').width}}>
                        <ScrollView
                            horizontal={true}
                            pagingEnabled={true}
                            showsHorizontalScrollIndicator={false}
                        >
                            {
                                auction && auction.image.map((item, key) => {
                                    return _renderAuctionImage(item, key)
                                })
                            }
                        </ScrollView>
                        {
                        isClose === true ?
                            <View style={[styles.center, {position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#00000080'}]}>
                                <Image
                                    style={{width: 180, height: 180}}
                                    source={require('../../Assets/ic_stamp.png')}
                                />
                            </View>
                        : isOpen === true ? 
                            <View style={{position: 'absolute', top: 56, left: 0, right: 0}}>
                                <View style={[styles. flex_row, {marginLeft: 16, marginTop: 8, height: 22, paddingHorizontal: 8, backgroundColor: '#1e1e1e', justifyContent: 'center', borderRadius: 2, alignSelf: 'baseline'}]}>
                                    <Image 
                                        style={{width: 13, height: 13}}
                                        width={13}
                                        height={13}
                                        source={require('../../Assets/ic_users.png')}
                                    />
                                    <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 12, color: '#ffffff', marginLeft: 2}}>
                                        {auction.bidding === null ? 0 : auction.bidding.length}명 입찰중
                                    </Text>
                                </View>
                            </View>
                        :
                            <View style={[styles.center, {position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#00000020'}]}>
                                <View style={[styles.center, {width: 180, height: 180, backgroundColor: '#00000060', borderRadius: 1000}]}>
                                    <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 24, color: '#ffffff', lineHeight: 32}}>오픈 예정</Text>
                                    <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 18, color: '#04dea0', lineHeight: 32}}>
                                        {moment(auction.start_date).format('M월 DD일 (HH:mm)')}
                                    </Text>
                                </View>
                            </View>
                        }
                    </View>
                    <View style={{backgroundColor: 'white', padding: 16}}>
                        <View style={{flexDirection: 'row'}}>
                            <View style={{flex: 1, paddingRight: 16}}>
                                <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 20, color: '#1e1e1e', paddingRight: 16, lineHeight: 32}} numberOfLines={2}>
                                    {auction.name}
                                </Text>
                                <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 14, color: '#909090', lineHeight: 22, marginTop: 4}}>
                                    {user.name ? user.name : user.email}
                                </Text>
                                <View style={[styles.flex_row, {marginTop: 12}]}>
                                    <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 24, color: '#1e1e1e', lineHeight: 32}}>
                                        {auction.start_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        <Text style={{fontSize: 18}}>원</Text>
                                    </Text>
                                    <View style={[styles.center, {backgroundColor: '#ececec', height: 22, paddingHorizontal: 4, marginLeft: 6, borderRadius: 2}]}>
                                        <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 12, color: '#666666'}}>
                                            시작가
                                        </Text>
                                    </View>
                                    <View style={[styles.center, {height: 22, paddingHorizontal: 4, marginLeft: 6, borderRadius: 2, borderWidth: 1, borderColor: '#bababa'}]}>
                                        <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 12, color: '#666666'}}>
                                            {auction.all_count}명까지 낙찰
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            
                            <TouchableOpacity 
                                style={[styles.center, like===true ? styles.heart_container_on : styles.heart_container_off]}
                                onPress={()=>{likeAuction()}}
                            >
                                <Image
                                    style={{width: 24, height: 24, tintColor: like===true ? '#ffffff' :'#888888'}}
                                    width={24}
                                    height={24}
                                    source={require('../../Assets/ic_heart_white_bold.png')}
                                />
                            </TouchableOpacity>
                            
                        </View>
                        {
                            isOpen === true && remainSeconds ?
                                <View style={[styles.center, {backgroundColor: remainSeconds > 600 ? '#1e1e1ecc' : '#ee4442', height: 36, width: '100%', borderRadius: 2, marginTop: 16, marginBottom: 8}]}>
                                    <View style={[styles.flex_row]}>
                                        <Image 
                                            style={{width: 20, height: 20, tintColor: '#ffffff'}} 
                                            width={20} 
                                            height={20}
                                            source={require('../../Assets/ic_clock_green.png')}
                                        />
                                        <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 14, color: '#ffffff', marginLeft: 8}}>
                                            {getRemainString(remainSeconds)} 남음
                                        </Text>
                                    </View>
                                </View>
                            : null
                        }
                        {
                            isClose === true ?
                                <View style={[styles.center, {backgroundColor: '#ececec', height: 36, width: '100%', borderRadius: 2, marginTop: 16, marginBottom: 8, borderColor: '#e0e0e0', borderWidth: 1}]}>
                                    <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 14, color: '#888888', marginLeft: 8}}>
                                        경매가 완료된 상품입니다
                                    </Text>
                                </View>
                            : null
                        }
                        {
                            isClose === true && auction.bid && (auction.bid.state === "2" || auction.bid.state === "3") ?
                                <TouchableOpacity 
                                    style={[styles.center, {backgroundColor: '#1e1e1e', height: 40, width: '100%', borderRadius: 2, marginTop: 16, marginBottom: 8}]}
                                    onPress={onPressBidHistory}
                                >
                                    <View style={[styles.flex_row]}>
                                        <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 14, color: '#ffffff', marginLeft: 8}}>
                                            입찰결과 보기
                                        </Text>
                                        <Ionicons
                                            size={20}
                                            color={'#ffffff'}
                                            name={'chevron-forward'}
                                        />
                                    </View>
                                </TouchableOpacity>
                            : null
                        }
                    </View>
                    <View style={{backgroundColor: 'white', marginTop: 8}}>
                        <View style={[styles.flex_row]}>
                            <View style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, backgroundColor: '#ececec'}}/>
                            <View >
                                <TouchableOpacity 
                                    style={{height: 54, justifyContent: 'center', paddingHorizontal: 16}}
                                    onPress={()=>{setRuleTab(0)}}
                                >
                                    <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 15, color: ruleTab === 0 ? '#1e1e1e' : '#909090'}}>참여규정</Text>
                                </TouchableOpacity>
                                { ruleTab == 0 ? <View style = {{height: 2, width: '100%', backgroundColor: '#1e1e1e'}}/>: null }
                            </View>
                            <View>
                                <TouchableOpacity 
                                    style={{height: 54, justifyContent: 'center', paddingHorizontal: 16}}
                                    onPress={()=>{setRuleTab(1)}}
                                >
                                    <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 15, color: ruleTab === 1 ? '#1e1e1e' : '#909090'}}>재입찰 및 취소규정</Text>
                                </TouchableOpacity>
                                { ruleTab == 1 ? <View style = {{height: 2, width: '100%', backgroundColor: '#1e1e1e'}}/>: null }
                            </View>
                        </View>
                        {
                            ruleTab === 0 ? (
                                <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 14, color: '#909090', paddingHorizontal: 16, marginVertical: 20}}>
                                    1. 옥션 마감 후 상위 입찰 가격 순으로 낙찰됩니다.
                                    {'\n'}
                                    2. 낙찰 시, 입찰하신 가격이 낙찰금으로 결정됩니다.
                                    {'\n'}
                                    3. 낙찰 시, 낙찰금은 해당 상품 페이지에서 결제 버튼으로 3일 이내 지급할 수 있습니다.
                                    {'\n'}
                                    4. 구매 결정과 입찰 가격은 온전히 플리옥션 사용자님의 판단으로 이뤄졌으며, 입찰 이후 취소는 불가함으로 사전 에 충분히 이해하고 입찰 해주시길 바랍니다.
                                </Text>
                            ) : (
                                <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 14, color: '#909090', paddingHorizontal: 16, lineHeight: 22, marginVertical: 20}}>
                                    1.이미 입찰한 가격이 아닌, 새로운 가격에 재 입찰 시 원래 입찰한 가격은 초기화되며 가장 마지막에 입찰한 가격으로 순위가 결정됩니다.
                                    {'\n'}
                                    2. 한번 입찰을 하게 되면 취소는 불가합니다.
                                </Text>
                            )
                        }
                        
                    </View>
                    <View style={{backgroundColor: 'white', padding: 16, marginTop: 8}}>
                        <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 20, color: '#1e1e1e', paddingRight: 16, lineHeight: 32}} numberOfLines={2}>
                            기증품 설명
                        </Text>
                        <View style={{marginVertical: 16}}>
                            <HTML 
                                source={{html: auction.auction_description || '<p></p>'}}
                                ignoredStyles={["font-family", "letter-spacing"]}
                            />
                        </View>
                        
                    </View>
                    <View style={{padding: 16, marginTop: 8}}>
                        <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 20, color: '#1e1e1e', paddingRight: 16, lineHeight: 32}} numberOfLines={2}>
                            기증자 홍보 영상
                        </Text>
                        <VideoPlayer
                            endWithThumbnail
                            style={{marginTop: 20}}
                            video={{ uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' }}
                            // videoWidth={1600}
                            // videoHeight={900}
                            thumbnail={{ uri: thumbnail }}
                            disableFullscreen={false}
                            fullScreenOnLongPress={true}
                        />
                    </View>
                    <View style={{backgroundColor: 'white', marginTop: 32, padding: 16}}>
                        <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 18, color: '#1e1e1e', lineHeight: 32}}>기부 캠페인 정보</Text>
                        <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 14, color: '#555555', marginTop: 16, lineHeight: 24}}>판매금액은 아래 캠페인에 기부됩니다</Text>
                        <Image 
                            style={{width: '100%', height: 160, marginTop: 16}}
                            width={'100%'}
                            height={160}
                            source={{uri: auction.auction_campaign_image}}
                        />
                        <TouchableOpacity 
                            style={[styles.center, {height: 48, borderRadius: 2, backgroundColor: '#ececec', borderRadius: 2, borderWidth: 1, marginTop: 12, borderColor: '#e0e0e0'}]}
                            onPress={()=>{navigation.push('CampaignDetailScreen', {campaign_id: parseInt(auction.campaign_id)})}}
                        >
                            <View style={styles.flex_row}>
                                <Text style={[{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 14, color: '#1e1e1e'}]}>캠페인 자세히 알아보기</Text>
                                <Ionicons
                                    size={20}
                                    color={'#888888'}
                                    name={'chevron-forward'}
                                />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.center, {height: 92, borderRadius: 2, borderRadius: 2, borderWidth: 1, marginTop: 16, borderColor: '#e0e0e0'}]}
                            onPress={()=>{
                                Linking.openURL(auction.auction_campaign_link)
                            }}
                        >
                            <Image 
                                style={{height: 32, width: '100%'}}
                                height={32}
                                width='100%'
                                resizeMode={'contain'}
                                source={{uri: auction.organization.logo}}
                            />

                            <Text style={[{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 14, color: '#1e1e1e', marginTop: 8}]}>
                                {auction.organization.name}
                            </Text>
                        </TouchableOpacity>
                        <View style={{height: 32}}/>
                    </View>
                </Animated.ScrollView>
                <Animated.View style={[styles.shadow, styles.header, {transform: [{ translateY: headerPosition }]}]}>
                    <TouchableOpacity 
                        style={styles.header_left}
                        onPress={()=>{navigation.pop()}}
                    >
                        <Ionicons
                            size={24}
                            color={'#ffffff'}
                            name={'chevron-back'}
                        />
                    </TouchableOpacity>
                    <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 18, color: '#ffffff'}}>모두 옥션</Text>
                </Animated.View>
                <Animated.View style={[styles.header, {backgroundColor: 'white', opacity: headerOpacity}]}>
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
                    <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 18, color: '#1e1e1e'}}>모두 옥션</Text>
                </Animated.View>
                {
                    isClose === true ? 
                        auction.bid && (auction.bid.state === "2" || auction.bid.state === "3") ?
                            <TouchableOpacity 
                                style={[styles.center, {height: 64, backgroundColor: '#04dea0'}]}
                                onPress={()=>{setPayAlert(true)}}
                            >
                                <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 18, color: '#ffffff'}}>
                                    결제하기
                                </Text>
                            </TouchableOpacity>
                        : null
                    : isOpen === true ?
                        <TouchableOpacity 
                            style={[styles.center, {height: 64, backgroundColor: '#04dea0'}]}
                            onPress={()=>{showInputBid({show: true, price: auction.start_price, unit: auction.interval_price})}}
                        >
                            <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 18, color: '#ffffff'}}>입찰하기</Text>
                        </TouchableOpacity>
                    : null
                }
                
            </View>
            <BidAuctionModal
                okAction={(price) => {
                    setBidPrice(price)
                    setBidAlert(true)
                }}
                dismissAction={()=>{showInputBid({show: false})}}
            />
            {
                bidAlert === true ? (
                    <LiveAuctionBidAlert
                        confirnAction={onPressBidConfirm}
                        dismissAction={()=>setBidAlert(false)}
                    />
                ) : null
            }
            {
                payAlert === true ? (
                    <LiveAuctionPayAlert
                        confirnAction={()=>setDidPay(true)}
                        dismissAction={()=>setPayAlert(false)}
                    />
                ) : null
            }
            {
                didPay === true ? (
                    <LiveAuctionPayGuideAlert
                        confirnAction={onPressPayConfirm}
                        dismissAction={()=>setDidPay(false)}
                    />
                ) : null
            }
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#FFFFFF",
        flex: 1,
    },
    header: {
        position: 'absolute',
        top:0,
        left:0,
        right:0,
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
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 1,
        shadowRadius: 1,
        elevation: 1
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
    setApiLoading, 
    showAlert,
    showInputBid
}

export default connect(
    mapStateToProps, 
    mapDispatchToProps
)(MultiAuctionScreen);
