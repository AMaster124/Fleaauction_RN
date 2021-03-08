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
    Dimensions
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import moment from 'moment';

import {setApiLoading} from '../../Redux/action/globalAction'
import {showAlert} from '../../Redux/action/AlertAction'
import APIKit from '../../Config/APIKit';

const FavoriteListScreen = (props) => {
    const {navigation, setApiLoading, showAlert} = props
    const [favorites, setFavorites] = useState(null)

    useEffect(() => {
        loadFavorites()
    }, [])

    const loadFavorites = () => {
        setApiLoading(true)
        APIKit.post('users/get-liked-list')
        .then( (res) => {
            setApiLoading(false)
            const data = res.data
            if(!data) {
                return
            }

            const status = data.status
            if(status === true) {
                setFavorites(data.results.list)
            } else {
                showAlert({message: data.msg})
            }
        })
        .catch(error => {
            setApiLoading(false)
            console.log('get-liked-list', error.message)
        })
    }

    const deleteLikes = (list) => {
        setApiLoading(true)
        APIKit.post('users/delete-liked', {like_ids: list})
        .then( (res) => {
            setApiLoading(false)
            const data = res.data
            if(!data) {
                return
            }
            console.log(data)

            const status = data.status
            if(status === true) {
                loadFavorites()
            } else {
                showAlert({message: data.msg})
            }
        })
        .catch(error => {
            setApiLoading(false)
            console.log('users/delete-liked', error.message)
        })
    }

    const onPressDeleteAll = () => {
        showAlert({message: "정말 삭제하시겠습니까?", isConfirm: true, confirmAction: () => {
            let list = []
            for( let i = 0; i < favorites.length; i++) {
                list.push(favorites[i].id)
            }

            deleteLikes(list)
        }})
        
    }

    const _renderFavoriteItem = (item, key) => {
        if( !item || !item.auction) {
            return null
        }

        let images = item.auction.image
        if(images) {
            images = JSON.parse(item.auction.image)
        } else {
            images = []
        }

        let end_date = item.auction.all_finish_date ? item.auction.all_finish_date : item.auction.ended_date
        end_date = moment(end_date)
        const now = moment()
        const isClose = now.diff(end_date, 'seconds') > 0

        const onPressDelete = () => {
            showAlert({message: "정말 삭제하시겠습니까?", isConfirm: true, confirmAction: () => {
                deleteLikes([item.id])
            }})
        }

        return (
            <TouchableOpacity
                key={key}
                style={{padding: 1, width: Dimensions.get('window').width/3, height: Dimensions.get('window').width/3}}
                onPress={() => {
                    if(item.auction.role === 'live') {
                        navigation.push('LiveAuctionScreen', {id: item.auction.id})
                    } else {
                        navigation.push('MultiAuctionScreen', {id: item.auction.id})
                    }
                }}
            >
                <Image
                    style={{width: '100%', height: '100%'}}
                    width={'100%'}
                    height={'100%'}
                    source={{uri: images[0].url}}
                />
                {
                    isClose === true ?
                        <View style={[styles.center, {position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#00000080'}]}>
                            <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 15, color: '#ffffff'}}>경매완료</Text>
                        </View>
                    : null
                }
                <TouchableOpacity 
                    style={{position: 'absolute', top: 0, right: 0, padding: 8}}
                    onPress={onPressDelete}
                >
                    <Ionicons
                        name={'close-circle'}
                        color={isClose === true ? '#ffffff' : '#bababa'}
                        size={24}
                    />
                </TouchableOpacity>
            </TouchableOpacity>
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
                    <TouchableOpacity 
                        style={styles.header_right}
                        onPress={onPressDeleteAll}
                    >
                        <FontAwesome
                            name='trash-o'
                            color='#1E1E1E'
                            size={24}
                        />
                    </TouchableOpacity>
                    <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 18, color: '#1e1e1e'}}>관심목록</Text>
                </View>
                <ScrollView style={{flex: 1, paddingTop: 12}}>
                    <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                        {
                            favorites && favorites.map((item, key) => {
                                return _renderFavoriteItem(item, key)
                            })
                        }
                    </View>
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
)(FavoriteListScreen);
