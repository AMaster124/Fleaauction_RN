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
    ScrollView,
    RefreshControl
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'
import TimeAgo from 'react-native-timeago'
import moment from 'moment';

import {setApiLoading} from '../../Redux/action/globalAction'
import {showAlert} from '../../Redux/action/AlertAction'
import APIKit from '../../Config/APIKit';

require('moment/locale/ko');
moment.locale('ko')

const AuctionScreen = (props) => {
    const {navigation, showAlert, setApiLoading} = props

    const [refreshing, setRefreshing] = useState(false)

    const [events, setEvents] = useState(null)

    useEffect(() => {
        loadEvents()
    }, [])

    const loadEvents = () => {
        setApiLoading(true)
        const payload = {start: 0, end: 99999999}
        APIKit.post('events/event-list', payload)
        .then( (res) => {
            setApiLoading(false)
            const data = res.data
            if(!data) {
                return
            }

            const status = data.status
            if(status === true) {
                const evts = data.results.list.sort((a, b) => {
                    return a.registered_date < b.registered_date
                })
                setEvents(evts)
                setRefreshing(false)
            } else {
                showAlert({message: data.msg})
            }
        })
        .catch(error => {
            if(error.message === 'Network Error') {
                setTimeout(() => {loadEvents()}, 500)
            } else {
                setApiLoading(false)
                console.log('events/event-list', error.message)
            }
        })
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true)
        loadEvents()
    }, [])

    const _renderAuctionItem = (item, key) => {
        let desc = item.description
        let destItems = null

        const strs = desc.split('%%%')
        if(strs.length === 2) {
            desc = strs[0]
            destItems = JSON.parse(strs[1])
        }


        return (
            <View key={key} style={{padding: 16}}>
                <View style={[styles.flex_row, {justifyContent: 'space-between'}]}>
                    <View style={styles.flex_row}>
                        <Image
                            style={{width: 24, height: 24}}
                            width={24}
                            height={24}
                            source={{uri: item.imoticon_img}}
                        />
                        <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 16, color: '#1e1e1e', marginLeft: 8, lineHeight: 24}}>{item.title}</Text>
                    </View>
                    {/* <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 12, color: '#909090', lineHeight: 18}}>{'20분'} 전</Text> */}
                    <TimeAgo 
                        time={moment(item.registered_date)}     // .add(-9, 'hours')
                        interveal={20000} 
                        style={{fontFamily: 'NotoSansCJKkr-Regular', color: '#909090', fontSize: 12, marginLeft: 8, lineHeight: 18}}
                    />
                </View>
                <View style={{marginLeft: 32, marginTop: 8}}>
                    <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 14, color: '#1e1e1e', lineHeight: 18}}>{desc}</Text>
                    {
                        destItems ? (
                            <View style={{paddingVertical: 12}}>
                            {
                                destItems.map((item, key) => {
                                    return(
                                        <Text key={key} style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 14, color: '#1e1e1e', lineHeight: 18}}>{item}</Text>
                                    )
                                })
    
                            }
                            </View>
                        )
                        : null
                    }
                    <Image
                        style={{width: '100%', height: 112, marginTop: 16, borderRadius: 4}}
                        width={'100%'}
                        height={112}
                        source={{uri: JSON.parse(item.image)}}
                    />
                </View>
            </View>
        )
    }

    return (
        <View style={[styles.container]}>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={{flex: 1}}>
                <View style={styles.header}>
                    {/* <TouchableOpacity 
                        style={styles.header_right}
                        onPress={()=>{navigation.pop()}}
                    >
                        <Ionicons
                            size={24}
                            color={'#1e1e1e'}
                            name={'close'}
                        />
                    </TouchableOpacity> */}
                    <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 18, color: '#1e1e1e'}}>옥션하자</Text>
                </View>
                <View style={{width: '100%', height: 1, backgroundColor: '#ececec'}}/>
                <ScrollView 
                    style={{flex: 1}}
                    bounces={true}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                >
                {
                    events && events.map((item, key) => {
                        return _renderAuctionItem(item, key)
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
    showAlert, 
    setApiLoading
}

export default connect(
    mapStateToProps, 
    mapDispatchToProps
)(AuctionScreen);
