import React, {useState, useEffect, useCallback} from 'react';
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
    ImageBackground,
    RefreshControl,
    ScrollView,
    Linking
} from 'react-native';
import moment from 'moment';

import {showFilterModal} from '../../Redux/action/ModalAction'
import FilterAuctionModal from '../../Components/Modals/FilterAuctionModal';

import {setApiLoading} from '../../Redux/action/globalAction'
import {showAlert} from '../../Redux/action/AlertAction'
import APIKit from '../../Config/APIKit';

import {fcmService} from '../../Components/fcm/FCMService'
import {localNotificationService} from '../../Components/fcm/LocalNotificationService'
import messaging from '@react-native-firebase/messaging';

import {WebView} from 'react-native-webview'

moment.locale('ko')
const FILTER_TYPE_CLOSE     = '마감 임박순'
const FILTER_TYPE_BID       = '응찰순'
const FILTER_TYPE_LIKE      = '좋아요순'
const FILTER_TYPE_START     = '옥션시작순'

let timer = null

const HomeScreen = (props) => {
    const {navigation, showFilterModal, setApiLoading, showAlert, user} = props

    const [tab, setTab] = useState(0)
    const [allAuctions, setAllAuctions] = useState(null)
    const [liveAuctions, setLiveAuctions] = useState(null)
    const [events, setEvents] = useState(null)
    const [filterType, setFilterType] = useState(FILTER_TYPE_LIKE)
    const [eventPage, setEventPage] = useState(0)
    const [liveHotMin, setLiveHotMin] = useState(1)

    const [refreshing, setRefreshing] = useState(false)

    const [remainSeconds, setRemainSeconds] = useState(null)

    useEffect(() => {
        fcmService.registerAppWithFCM();
        fcmService.register(onRegister, onNotification, onOpenNotification);
        localNotificationService.configure(onOpenNotification)
    
        function onRegister(token) {
            console.log("[App] onRegister: ", token);
            if(user && user.id) {
                setApiLoading(true)
                APIKit.post('users/register-push-token', {token: token})
                .then( (res) => {
                    setApiLoading(false)
                })
                .catch(error => {
                    setApiLoading(false)
                    console.log('users/register-push-token', error.message)
                })   
            }
        }
    
        function onNotification(notify) {
            console.log("[App] onNotification: ", notify);
            const options = {
                soundName: 'default',
                playSound: true
            }
            localNotificationService.showNotification(
                0,
                notify.title,
                notify.body,
                notify,
                options
            )
        }
    
        function onOpenNotification(notify) {
            console.log("[App] onOpenNotification: ", notify);
        }
    
        messaging().setBackgroundMessageHandler(async remoteMessage => {
            console.log('Message handled in the background!', remoteMessage);
        });

        return () => {
            console.log("[App] unRegister");
            fcmService.unRegister();
            localNotificationService.unregister();
        }
       
    }, [])

    useEffect(() => {
        loadLiveAllAuctions()
        loadEvents()
        // setEvents(event_dummy)

        return () => {
            stopTimer()
        }
    }, [])

    useEffect(() => {
        if(tab === 0) {
            setLiveAuctions(sortList(liveAuctions))
        } else {
            setAllAuctions(sortList(allAuctions))
        }
    }, [filterType])

    useEffect(() => {
        startTimer()
    }, [allAuctions])

    const loadLiveAllAuctions = () => {
        loadAuctions(true, ()=>{loadAuctions(false, null)})
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true)
        loadLiveAllAuctions()
        loadEvents()
    }, [])

    const loadAuctions = (live, callback) => {
        setApiLoading(true)
        const payload = {flag: false, role: live === true ? 'live' : 'all', start: 0, end: 99999999}
        APIKit.post('auctions/auction-list', payload)
        .then( (res) => {
            setApiLoading(false)
            const data = res.data
            if(!data) {
                return
            }

            const status = data.status
            if(status === true) {
                if(live === true) {
                    setLiveHotMin(getHotMin(data.results.list))
                    setLiveAuctions(sortList(data.results.list))
                } else {
                    setAllAuctions(sortList(data.results.list))
                }
            } else {
                showAlert({message: data.msg})
            }

            if(callback !== null) {
                callback()
            } else {
                setRefreshing(false)
            }
        })
        .catch(error => {
            setApiLoading(false)
            console.log('auctions/auction-list', error.message)
        })
    }

    const loadEvents = () => {
        setApiLoading(true)
        const payload = {start: 0, end: 4}
        APIKit.post('events/event-list', payload)
        .then( (res) => {
            setApiLoading(false)
            const data = res.data
            if(!data) {
                return
            }

            const status = data.status
            if(status === true) {
                setEvents(data.results.list)
            } else {
                showAlert({message: data.msg})
            }
        })
        .catch(error => {
            setApiLoading(false)
            console.log('events/event-list', error.message)
        })
    }

    const startTimer = () => {
        stopTimer()

        if(allAuctions && allAuctions.length > 0) {
            let seconds = []
            for(let i = 0; i < allAuctions.length; i++) {
                seconds.push(getRemainSeconds(allAuctions[i]))
            }

            setRemainSeconds(seconds)
        }

        timer = setTimeout(startTimer, 300)
    }

    const stopTimer = () => {
        if(timer !== null) {
            clearTimeout(timer)
        }
    }

    const getHotMin = (auctions) => {
        if(!auctions || auctions.length < 1) {
            return 1
        }

        let hotCnt = Math.ceil(auctions.length / 10)
        if(hotCnt === 0) {
            hotCnt = 1
        }

        const sorted = auctions.sort((a, b) => {
            return a.biddings < b.biddings ? 1 : -1
        })

        return sorted[hotCnt-1].biddings

    }

    const sortList = (auctions) => {
        if(auctions === null) {
            return []
        }

        const sorted = auctions.sort((a, b) => {
            if(filterType === FILTER_TYPE_LIKE) {
                return a.likes < b.likes ? 1 : -1
            } else {
                return a.start_date > b.start_date ? 1 : -1
            }
        })

        // console.log(sorted)

        return [...sorted]
    }

    const itemW = (Dimensions.get('window').width-49)/2

    const checkOpen = (item) => {
        let start_date = item.start_date ? item.start_date : item.registered_date
        start_date = moment(start_date)
        const now = moment()
        const isOpen = now.diff(start_date, 'seconds') > 0
        return isOpen
    }

    const checkClose = (auction) => {

        if(!auction || !auction.all_finish_date) {
            return false
        }

        let end_date = auction.all_finish_date ? auction.all_finish_date : auction.ended_date
        end_date = moment(end_date)
        const now = moment()
        const close = now.diff(end_date, 'seconds') > 0

        return close
    }

    const getRemainSeconds = (item) => {
        if(item === null) {
            return 0
        }

        const end_date = moment(item.all_finish_date)
        const now = moment()
        const diff = end_date.diff(now, 'seconds')

        return diff
    }

    const getRemainString = (seconds) => {
        if(seconds > 3600*24) {
            return `${(seconds / (3600*24)).toFixed(0)}일`
        }

        if(seconds > 3600) {
            return `${(seconds / (3600)).toFixed(0)}시간`
        }

        if(seconds > 60) {
            return `${(seconds / (3600)).toFixed(0)}분`
        }

        return `${(seconds / (3600)).toFixed(0)}초`
    }

    const _handlerEventSlider = (e) => {
        const x = e.nativeEvent.contentOffset.x
        const currentPage = Math.ceil(x / Dimensions.get('window').width)
        if(currentPage !== eventPage) {
            setEventPage(currentPage)
        }
    }

    const _renderLiveItem = (item, key) => {
        let img = JSON.parse(item.image)
        if(img.length < 1) {
            img = null
        } else {
            img = img[0]
        }

        const isOpen = checkOpen(item)
        const isClose = checkClose(item)

        return(
            <TouchableOpacity 
                key={`live_${key}`} 
                style={{width: itemW, marginVertical: 24, marginLeft: 16, marginRight: key%2 === 0 ? 0 : 16}}
                onPress={()=>{navigation.push('LiveAuctionScreen', {id: item.id})}}
            >
                <ImageBackground
                    style={{width: '100%', aspectRatio: 1, borderRadius: 4, overflow: 'hidden'}}
                    resizeMode={'cover'}
                    source={{uri: img.url}}
                >
                    {
                        isClose === true ?
                            <View style={[styles.center, {position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#00000080'}]}>
                                <Image
                                    style={{width: '70%', height: '70%'}}
                                    source={require('../../Assets/ic_stamp.png')}
                                />
                            </View>
                        : isOpen === false ?
                            <View style={[styles.center, {width: '100%', height: '100%', backgroundColor: '#00000080'}]}>
                                {/* <ImageBackground
                                    style={[styles.center, {width: '50%', aspectRatio: 1, borderRadius: 300, overflow: 'hidden'}]}
                                    resizeMode={'contain'}
                                    source={require('../../Assets/img_bg_circle.png')}
                                > */}
                                    {/* <View style={{alignItems: 'center'}}> */}
                                        <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 18, color: '#ffffff', lineHeight: 24}}>오픈 예정</Text>
                                        {/* <View style={{height: 1, width: 55, backgroundColor: '#00000033'}}/> */}
                                        <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 14, color: '#04dea0', lineHeight: 24}}>
                                            {moment(item.start_date).format('M월 DD일 (HH:mm)')}
                                        </Text>
                                    {/* </View> */}
                                    
                                {/* </ImageBackground> */}
                            </View>
                        : null
                    }
                    { 
                        item.biddings >= liveHotMin ?
                            <Image
                                style={{position: 'absolute', top: 8, right: 8, width: 36, height: 36}}
                                width={36}
                                height={36}
                                resizeMode={'contain'}
                                source={require('../../Assets/ic_hot.png')}
                            />
                        : null
                    }
                    {/* <TouchableOpacity style={[styles.center, {position: 'absolute', bottom: 8, right: 8, width: 32, height: 32, borderRadius: 100, backgroundColor: item.like === true ? '#04dea0' : '#00000066'}]}>
                        <Image
                            style={{width: 24, height: 24}}
                            width={24}
                            height={24}
                            resizeMode={'contain'}
                            source={require('../../Assets/ic_heart_white_bold.png')}
                        />
                    </TouchableOpacity> */}
                </ImageBackground>
                <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 14, color: '#1e1e1e', lineHeight: 26, marginTop: 12, }} numberOfLines={2}>
                    {item.name}
                </Text>
                <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 18, color: '#1e1e1e', lineHeight: 24, marginTop: 4}}>
                    {item.start_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원
                </Text>
            </TouchableOpacity>
        )
    }

    const _renderAllItem = (item, key) => {
        let img = JSON.parse(item.image)
        if(img.length < 1) {
            img = null
        } else {
            img = img[0]
        }

        const isOpen = checkOpen(item)
        const isClose = checkClose(item)
        return(
            <TouchableOpacity 
                key={key} 
                style={{width: itemW, marginTop: 24, marginLeft: 16, marginRight: key%2 === 0 ? 0 : 16}}
                onPress={()=>{navigation.push('MultiAuctionScreen', {id: item.id})}}
            >
                <ImageBackground
                    style={{width: '100%', aspectRatio: 1, borderRadius: 4, overflow: 'hidden'}}
                    resizeMode={'cover'}
                    source={{uri: img.url}}
                >
                    {
                        isClose === true ?
                        <View style={[styles.center, {position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#00000080'}]}>
                            <Image
                                style={{width: '70%', height: '70%'}}
                                source={require('../../Assets/ic_stamp.png')}
                            />
                        </View>
                        : isOpen === false ?
                            <View style={[styles.center, {width: '100%', height: '100%', backgroundColor: '#0000004c'}]}>
                                {/* <ImageBackground
                                    style={[styles.center, {width: '50%', aspectRatio: 1, borderRadius: 300, overflow: 'hidden'}]}
                                    resizeMode={'contain'}
                                    source={require('../../Assets/img_bg_circle.png')}
                                > */}
                                    {/* <View style={{alignItems: 'center'}}> */}
                                        <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 18, color: '#ffffff', lineHeight: 24}}>오픈 예정</Text>
                                        {/* <View style={{height: 1, width: 55, backgroundColor: '#00000033'}}/> */}
                                        <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 14, color: '#04dea0', lineHeight: 24}}>
                                            {moment(item.start_date).format('M월 DD일 (HH:mm)')}
                                        </Text>
                                    {/* </View> */}
                                    
                                {/* </ImageBackground> */}
                            </View>
                        : null
                    }
                    {/* {
                        isOpen === true && remainSeconds?
                            <View style={[styles.flex_row, {position: 'absolute', top: 8, left: 8, }]}>
                                <View style={{height: 21, justifyContent: 'center', borderRadius: 2, paddingHorizontal: 6, backgroundColor: remainSeconds[key] <= 600 ? '#ee4442' : '#1e1e1ecc'}}>
                                    <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 11, color: 'white'}}>{getRemainString(remainSeconds[key])} 뒤 종료</Text>
                                </View>
                                <View style={{height: 21, justifyContent: 'center', borderRadius: 2, paddingHorizontal: 6, marginLeft: 2, backgroundColor: '#ffa600'}}>
                                    <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 11, color: 'white'}}>{item.biddings}명</Text>
                                </View>
                            </View>
                        : null                        
                    } */}
                    { 
                        item.hot === true ?
                            <Image
                                style={{position: 'absolute', top: 8, right: 8, width: 36, height: 36}}
                                width={36}
                                height={36}
                                resizeMode={'contain'}
                                source={require('../../Assets/ic_hot.png')}
                            />
                        : null
                    }
                    {/* <TouchableOpacity style={[styles.center, {position: 'absolute', bottom: 8, right: 8, width: 32, height: 32, borderRadius: 100, backgroundColor: item.like === true ? '#04dea0' : '#00000066'}]}>
                        <Image
                            style={{width: 24, height: 24}}
                            width={24}
                            height={24}
                            resizeMode={'contain'}
                            source={require('../../Assets/ic_heart_white_bold.png')}
                        />
                    </TouchableOpacity> */}
                </ImageBackground>
                <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 14, color: '#1e1e1e', lineHeight: 26, marginTop: 12, }} numberOfLines={2}>
                    {item.name}
                </Text>
                <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 18, color: '#1e1e1e', lineHeight: 24, marginTop: 4}}>
                    {item.start_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원
                </Text>
            </TouchableOpacity>
        )
    }

    const _renderEvent = (item, key) => {
        return (
            <Image
                key={key}
                style={[{height: 224, width: Dimensions.get('window').width}]}
                width={Dimensions.get('window').width}
                height={224}
                resizeMode={'cover'}
                source={{uri: JSON.parse(item.image)}}
            />
        )
    }

    const _renderSlideDots = () => {
        const _renderFocusDot = (key) => {
            return (
                <View key={key} style={{width: 8, height: 8, borderRadius: 200, borderColor: 'white', borderWidth: 0.5, backgroundColor: '#1e1e1e', marginHorizontal: 3}}/>
            )
        }
        const _renderUnfocusDot = (key) => {
            return (
                <View key={key} style={{width: 8, height: 8, borderRadius: 200, borderColor: 'white', borderWidth: 0.5, backgroundColor: '#808080', marginHorizontal: 3}}/>
            )
        }
        return (
            <View style={[styles.flex_row]}>
                { 
                    events && events.map((item, key) => {
                        return (
                            eventPage === key ? _renderFocusDot(key) : _renderUnfocusDot(key)
                        )
                    })
                }
            </View>
        )
    }

    return (
        <View style={[styles.container]}>
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={{flex: 1}}>
                <View style={[styles.header]}>
                    <Image
                        style={[{height: 32, width: 132}]}
                        width={132}
                        height={32}
                        resizeMode={'contain'}
                        source={require('../../Assets/logo_fleaauction_horizontal.png')}
                    />
                    <TouchableOpacity
                        onPress={()=>{navigation.push('HomeSearchScreen')}}
                    >
                        <Image
                            style={{width: 24, height: 24}}
                            width={24}
                            height={24}
                            source={require('../../Assets/ic_search.png')}
                        />
                    </TouchableOpacity>
                </View>
                <ScrollView 
                    style={{flex: 1}}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                >
                    <View style={{height: 224}}>
                        <ScrollView
                            horizontal={true}
                            pagingEnabled={true}
                            showsHorizontalScrollIndicator={false}
                            scrollEventThrottle={16}
                            onMomentumScrollEnd={_handlerEventSlider}
                        >
                            {
                                events && events.map((item, key) => {
                                    return _renderEvent(item, key)
                                })
                            }
                        </ScrollView>
                        <View style={[styles.center, {position: 'absolute', bottom: 16, left: 0, right: 0, height: 8, alignSelf: 'center'}]}>
                            {_renderSlideDots()}
                        </View>
                    </View>
                    <View style={{height: 56, borderBottomWidth: 1, borderColor: '#ececec'}}>
                        <View style={[styles.flex_row, {justifyContent: 'space-between'}]}>
                            <View style={[styles.flex_row]}>
                                <View style={{height: '100%'}}>
                                    <TouchableOpacity 
                                        style={{height: '100%', justifyContent: 'center', paddingHorizontal: 16}}
                                        onPress={()=>{setTab(0)}}
                                    >
                                        <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 15, color: tab === 0 ? '#1e1e1e' : '#909090'}}>라이브 옥션</Text>
                                    </TouchableOpacity>
                                    { tab == 0 ? <View style = {{height: 2, width: '100%', backgroundColor: '#1e1e1e'}}/>: null }
                                </View>
                                <View style={{height: '100%'}}>
                                    <TouchableOpacity 
                                        style={{height: '100%', justifyContent: 'center', paddingHorizontal: 16}}
                                        onPress={()=>{setTab(1)}}
                                    >
                                        <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 15, color: tab === 1 ? '#1e1e1e' : '#909090'}}>모두 옥션</Text>
                                    </TouchableOpacity>
                                    { tab == 1 ? <View style = {{height: 2, width: '100%', backgroundColor: '#1e1e1e'}}/>: null }
                                </View>
                            </View>
                            <TouchableOpacity 
                                style={[styles.flex_row, {height: 32, paddingHorizontal: 8, borderRadius: 2, borderWidth: 1, borderColor: '#e0e0e0', marginRight: 16}]}
                                onPress={() => {showFilterModal({show: true, selected: filterType})}}
                            >
                                <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 12, color: '#1e1e1e'}}>
                                    {filterType}
                                </Text>
                                <Image
                                    style={{width: 12, height: 12, marginLeft: 10}}
                                    width={12}
                                    height={12}
                                    source={require('../../Assets/ic_chevron_down.png')}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                    {
                        tab === 1 ? (
                            allAuctions && allAuctions.map((item, key) => {
                                return _renderAllItem(item, key);
                            })
                        ) : (
                            liveAuctions && liveAuctions.map((item, key) => {
                                return _renderLiveItem(item, key);
                            })
                        )
                    }
                    </View>
                    <View style={{height: 50}}/>
                    <View style={{backgroundColor: '#000', paddingVertical: 16}}>
                        <View style={[styles.flex_row, {paddingHorizontal: 12}]}>
                            <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 11, color: '#fff', lineHeight: 24, width: 100}}>
                                (주)플리옥션 대표 : 
                            </Text>
                            <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 11, color: '#fff', lineHeight: 24}}>
                                이연주
                            </Text>
                        </View>
                        <View style={[styles.flex_row, {paddingHorizontal: 12}]}>
                            <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 11, color: '#fff', lineHeight: 24, width: 100}}>
                                사업자번호 : 
                            </Text>
                            <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 11, color: '#fff', lineHeight: 24}}>
                                878-81-01769
                            </Text>
                        </View>
                        <View style={[styles.flex_row, {paddingHorizontal: 12}]}>
                            <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 11, color: '#fff', lineHeight: 24, width: 100}}>
                                통신판매업 : 
                            </Text>
                            <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 11, color: '#fff', lineHeight: 24}}>
                                제 2021-서울서초-1074
                            </Text>
                        </View>
                        <View style={[{flexDirection: 'row', paddingHorizontal: 12}]}>
                            <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 11, color: '#fff', lineHeight: 24, width: 100}}>
                                사업장 주소지 : 
                            </Text>
                            <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 11, color: '#fff', lineHeight: 24, flex: 1}}>
                                {`[06621] 서울특별시 서초구 강남대로53길 8,\n스타크강남빌딩 10층`}
                            </Text>
                        </View>
                        <View style={[{flexDirection: 'row', paddingHorizontal: 12}]}>
                            <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 11, color: '#fff', lineHeight: 24, width: 100}}>
                                Contact : 
                            </Text>
                            <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 11, color: '#fff', lineHeight: 24, flex: 1}}>
                                02)3476-6007 biz@fleaauction.co
                            </Text>
                        </View>
                        <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 11, color: '#fff', alignSelf: 'center', textAlign: 'center', paddingHorizontal: 12, marginTop: 12, lineHeight: 24}}>
                            Copyright © FleaAuction All rights reserved.
                        </Text>
                    </View>
                    <View style={[styles.flex_row, {justifyContent: 'space-around', backgroundColor: '#eee', height: 50}]}>
                        <TouchableOpacity
                            onPress={()=>{Linking.openURL('https://www.fleaauction.co/%EC%9D%B4%EC%9A%A9%EC%95%BD%EA%B4%80')}}
                        >
                            <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 12, color: '#1e1e1e'}}>온라인경매약관</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={()=>{Linking.openURL('https://www.fleaauction.co/%EA%B0%9C%EC%9D%B8%EC%A0%95%EB%B3%B4%EC%B2%98%EB%A6%AC%EB%B0%A9%EC%B9%A8')}}
                        >
                            <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 12, color: '#1e1e1e'}}>개인정보보호방침</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
            <FilterAuctionModal
                okAction={(filterType) => {
                    setFilterType(filterType)
                }}
                dismissAction={()=>{showFilterModal({show: false, selected: filterType})}}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#FFFFFF",
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        alignItems: 'center',
        height: 56
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
        user: state.global.user
    }
}

const mapDispatchToProps = {
    showFilterModal,
    setApiLoading, 
    showAlert
}

export default connect(
    mapStateToProps, 
    mapDispatchToProps
)(HomeScreen);
