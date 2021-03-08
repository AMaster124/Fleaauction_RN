import React, {useState, useEffect, useRef} from 'react';
import {connect} from 'react-redux';

import { 
    StyleSheet, 
    View,
    Image,
    SafeAreaView,
    TouchableOpacity,
    Text,
    StatusBar,
    TextInput
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { ScrollView } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'

import {setApiLoading} from '../../Redux/action/globalAction'
import {showAlert} from '../../Redux/action/AlertAction'
import APIKit from '../../Config/APIKit';

const HomeSearchScreen = (props) => {
    const {navigation, setApiLoading, showAlert
    } = props

    const [searchStr, setSearchStr] = useState('')
    const [recents, setRecents] = useState([])

    const [auctions, setAuctions] = useState(null)
    const [pageCnt, setPageCnt] = useState(0)
    const [page, setPage] = useState(null)


    useEffect(() => {
        loadRecents()
    }, [])

    useEffect(() => {
        if(page === null) {
            setPage(0)
            return
        }
        
    }, [page])

    // useEffect(() => {
    //     if(searchStr.length < 1) {
    //         setAuctions([])
    //     } else {
    //         load_auctionss(searchStr)
    //     }
    // }, [searchStr])
    
    const loadRecents = async () => {
        const recentsJson = await AsyncStorage.getItem('recents')
        if(recentsJson) {
            setRecents(JSON.parse(recentsJson))
        }
    }

    const load_auctionss = (keyword) => {
        const payload = {keys: keyword, start: 20*page, end: 1*page + 19}
        APIKit.post('auctions/filter-list', payload)
        .then( (res) => {
            const data = res.data
            if(!data) {
                return
            }

            // console.log('auctions/filter-list', data)
            const status = data.status
            setPageCnt(data.count)
            if(status === true) {
                setAuctions(data.results)
            } else {
                showAlert({message: data.msg})
            }
        })
        .catch(error => {
            setApiLoading(false)
            console.log('auctions/filter-list', error.message)
        })
    }

    const saveRecents = () => {
        if(recents.length < 1) {
            AsyncStorage.removeItem('recents')
        } else {
            const size = Math.min(5, recents.length)
            AsyncStorage.setItem('recents', JSON.stringify(recents.slice(0, size)))
        }
    }

    const searchProc = (keyword) => {
        if(keyword.length < 1) {
            return
        }

        load_auctionss(keyword)
        setRecents([keyword, ...recents])
    }

    const _renderRecentItem = (item, key) => {
        const onPressCancelItem = () => {
            let array = [...recents]
            array.splice(key, 1)
            setRecents(array)
        }
    
        return (
            <View key={key} style={[styles.flex_row, {paddingVertical: 8}]}>
                <TouchableOpacity
                    style={{flex: 1}}
                    onPress={() => {
                        // searchProc(item)
                        setSearchStr(item)
                        load_auctionss(item)
                    }}
                >
                    <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 14, color: '#1e1e1e', lineHeight: 24}}>{item}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{padding: 4}}
                    onPress={onPressCancelItem}
                >
                    <MaterialCommunityIcons name='close' size={20} color={'#bababa'}/>
                </TouchableOpacity>
            </View>
        )
    }

    const _renderItem = (item, key) => {
        console.log(item)
        const images = JSON.parse(item.image)
        let img = null
        if(images.length > 0) {
            img = images[0]
        }

        return (
            <TouchableOpacity 
                key = {key}
                style={{flexDirection: 'row', marginHorizontal: 16, marginVertical: 12}}
                onPress={()=>{
                    item.role === 'alll' ?
                        navigation.push('MultiAuctionScreen', {id: item.id})
                    : 
                        navigation.push('LiveAuctionScreen', {id: item.id})
                    }}
            >
                <Image
                    style={{width: 88, height: 88, borderRadius: 4}}
                    source={{uri: img.url}}
                />
                <View style={{flex: 1, marginLeft: 12}}>
                    <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 14, color: '#1e1e1e', lineHeight: 24}}>
                        {item.name}
                    </Text>
                    <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 16, color: '#1e1e1e', lineHeight: 24}}>
                        {item.start_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원
                    </Text>
                </View>
            </TouchableOpacity>
        )
    }

    const onPressCancel = () => {
        saveRecents()
        navigation.pop()
    }

    return (
        <View style={[styles.container]}>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={{flex: 1}}>
                <View style={[styles.flex_row, {marginTop: 16, marginHorizontal: 12}]}>
                    <View style={[styles.search_container]}>
                        <Image
                            style={{width: 16, height: 16}}
                            width={16}
                            height={16}
                            source={require('../../Assets/ic_search.png')}
                        />
                        <TextInput 
                            placeholder={'검색어를 입력해주세요'}
                            placeholderTextColor={'#909090'}
                            value={searchStr}
                            onChangeText={setSearchStr}
                            style={{flex: 1, marginLeft: 8, color: '#1e1e1e'}}
                            onSubmitEditing={() => {
                                searchProc(searchStr)
                            }}
                            returnKeyType={'search'}
                        />
                    </View>
                    <TouchableOpacity
                        style={{paddingLeft: 16, paddingRight: 4}}
                        onPress={onPressCancel}
                    >
                        <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 16, color: '#1e1e1e'}}>취소</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView style={{flex: 1}}>
                    {
                        recents.length > 0 ? (
                            <View>
                                <View style={{padding: 16}}>
                                    <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 12, color: '#909090', marginVertical: 16}}>최근 검색</Text>
                                    {
                                        recents && recents.slice(0, Math.min(5, recents.length)).map((item, key) => {
                                            return _renderRecentItem(item, key)
                                        })
                                    
                                    }
                                </View>
                                <View style={{backgroundColor: '#f5f5f5', height: 8}}/>
                            </View>
                        ) : null
                    }
                    {/* <View style={{padding: 16}}>
                        <View style={[styles.flex_row, {justifyContent: 'space-between', paddingVertical: 16}]}>
                            <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 12, color: '#909090'}}>인기 옥션</Text>
                            <TouchableOpacity style={[styles.flex_row]}>
                                <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 12, color: '#1e1e1e'}}>모두 보기</Text>
                                <Ionicons
                                    size={20}
                                    color={'#888888'}
                                    name={'chevron-forward'}
                                />
                            </TouchableOpacity>
                        </View>
                        
                    </View> */}
                    <View style={{height: 12}}/>
                    {
                        auctions && auctions.map((item, key) => {
                            return _renderItem(item, key)
                        })
                    }
                    <View style={{height: 12}}/>
                </ScrollView>
                
            </SafeAreaView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#ffffff",
        flex: 1,
    },
    header: {
        height: 56,
        width: '100%',
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
    search_container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        height: 40, 
        backgroundColor: '#f5f5f5',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#ececec',
        paddingHorizontal: 8
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
        setApiLoading,
        showAlert
    }
}

const mapDispatchToProps = {
}

export default connect(
    mapStateToProps, 
    mapDispatchToProps
)(HomeSearchScreen);
