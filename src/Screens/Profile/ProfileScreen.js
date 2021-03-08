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
    TextInput,
    Button
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'
import ImagePicker from 'react-native-image-crop-picker'
import moment from 'moment';

import {setApiLoading} from '../../Redux/action/globalAction'
import {showAlert} from '../../Redux/action/AlertAction'
import APIKit from '../../Config/APIKit';
import {logout} from '../../Redux/action/globalAction'
import {showPhotoSelection} from '../../Redux/action/ModalAction'
import PhotoSelectionModal from '../../Components/Modals/PhotoSelectionModal';
import {userUpdate} from '../../Redux/action/globalAction'

const ProfileScreen = (props) => {
    const {navigation, setApiLoading, showAlert, user, logout, showPhotoSelection, userUpdate} = props
    // const [profileImg, setProfileImg] = useState(null)
    const [profileInfo, setProfileInfo] = useState(null)

    useEffect(() => {
        loadProfileInfo()
    }, [])

    useEffect(() => {
        const willFocus = navigation.addListener('willFocus', () => {
            console.log('ProfileScreen will Focus')
            loadProfileInfo()
        });

        const willBlur = navigation.addListener('willBlur', () => {
            console.log('ProfileScreen will Blur')
        });

        return () => {
            willBlur.remove()
            willFocus.remove()
        }
    }, [navigation])

    const loadProfileInfo = () => {
        setApiLoading(true)
        APIKit.post('users/get-profile')
        .then( (res) => {
            setApiLoading(false)
            const data = res.data
            if(!data) {
                return
            }

            const status = data.status
            if(status === true) {
                console.log(data.results)
                setProfileInfo(data.results)
            } else {
                showAlert({message: data.msg})
            }
        })
        .catch(error => {
            setApiLoading(false)
            console.log('users/get-profile', error.message)
        })
    }

    const pickedImage = (res) => {
        console.log(res)
        const img = `data:image/jpeg;base64,${res.data}`
        const payload = {
            name: user.name,
            photo: img,
            phone: user.phone,
            postal_code: user.postal_code,
            address: user.address,
            address_detail: user.address_detail
        }

        userUpdate(payload)
    }

    const _renderLikeItem = (item, key) => {
        if( !item || !item.auction) {
            return null
        }

        let images = item.auction.image
        if(images) {
            images = JSON.parse(item.auction.image)
        } else {
            images = []
        }

        // let start_date = item.auction.start_date ? item.auction.start_date : item.auction.registered_date
        // start_date = moment(start_date)
        // const now = moment()
        // const isOpen = now.diff(start_date, 'seconds') > 0
        let end_date = item.auction.all_finish_date ? item.auction.all_finish_date : item.auction.ended_date
        end_date = moment(end_date)
        const now = moment()
        const isClose = now.diff(end_date, 'seconds') > 0

        return (
            <View key={key} style={{marginRight: 12, borderRadius: 8, overflow: 'hidden'}}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                        if(item.auction.role === 'live') {
                            navigation.push('LiveAuctionScreen', {id: item.auction_id})
                        } else {
                            navigation.push('MultiAuctionScreen', {id: item.auction_id})
                        }
                    }}
                >
                    <Image
                        style={{width: 88, height: 88}}
                        source={{uri: images[0].url}}
                    />
                    {
                        isClose === true ?
                            <View style={[styles.center, {position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: '#00000080'}]}>
                                <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 15, color: '#ffffff'}}>경매완료</Text>
                            </View>
                        : null
                    }
                </TouchableOpacity>
            </View>
        )
    }

    const onPressPhotoType = (index) => {
        if(index === 0) {                    // 촬영
            ImagePicker.openCamera(
                {
                    mediaType: 'photo',
                    cropping: true,
                    includeBase64: true,
                    width: 128,
                    height: 128
                }) .then( response => {
                    pickedImage(response)
                }) .catch(e => {
                    console.log(e)
            })
        } else if ( index === 1 ) {          // 앨범
            ImagePicker.openPicker(
                {
                    mediaType: 'photo',
                    cropping: true,
                    includeBase64: true,
                    width: 128,
                    height: 128
                }) .then( response => {
                    pickedImage(response)
                }) .catch(e => {
                    console.log(e)
            })
        }
    }

    if(!user) {
        showAlert({message: '회원님의 로그인정보에 문제가 있습니다. 다시 로그인해주세요.', confirmAction: logout})
        return null
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
                    <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 18, color: '#1e1e1e'}}>마이 프로필</Text>
                </View>
                <View style={{width: '100%', height: 1, backgroundColor: '#ececec'}}/>
                <ScrollView style={{flex: 1}}>
                    <View style={{padding: 16}}>
                        <View style={[styles.flex_row, {marginTop: 8}]}>
                            <View>
                                <Image
                                    style={{width: 56, height: 56, borderRadius: 200}}
                                    width={56}
                                    height={56}
                                    // source={user.photo ? {uri: user.photo.url} : require('../../Assets/ic_profile_circle.png')}
                                    source={user.photo ? {uri: user.photo} : require('../../Assets/ic_profile_circle.png')}
                                />
                                <TouchableOpacity 
                                    style={[ styles.center, {position: 'absolute', right: -4, top: 0, width: 24, height: 24, borderRadius: 200, borderWidth: 1, borderColor: '#666666', backgroundColor: 'white'}]}
                                    onPress={() => showPhotoSelection(true)}
                                >
                                    <Image
                                        style={{width: 16, height: 16}}
                                        width={16}
                                        height={16}
                                        source={require('../../Assets/ic_camera.png')}
                                    />
                                </TouchableOpacity>
                            </View>
                            <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 16, color: '#1e1e1e', marginLeft: 16}}>
                                {user.name ? user.name : '- - -'}
                            </Text>
                            <TouchableOpacity 
                                style={{marginLeft: 4}}
                                onPress={()=>{navigation.push('ProfileEditScreen')}}
                            >
                                <Image
                                    style={{width: 16, height: 16}}
                                    width={16}
                                    height={16}
                                    source={require('../../Assets/ic_pen.png')}
                                />
                            </TouchableOpacity>
                            <View style={{flex: 1}}/>
                            <View style={[styles.flex_row, {paddingHorizontal: 24, height: 36, borderWidth: 1, borderRadius: 200, borderColor: '#ececec'}]}>
                                <Image
                                    style={{width: 24, height: 24}}
                                    width={24}
                                    height={24}
                                    source={require('../../Assets/ic_olive_active.png')}
                                />
                                <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 14, color: '#1e1e1e', marginLeft: 12}}>
                                    {(profileInfo && profileInfo.num_olibs) ? profileInfo.num_olibs : 0}개
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            style={[styles.center, {marginTop: 16, height: 48, borderWidth: 1, borderRadius: 4, borderColor: '#e0e0e0', backgroundColor: '#ececec'}]}
                            onPress={()=>{navigation.push('RewardScreen')}}
                        >
                            <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 16, color: '#1e1e1e', marginLeft: 12}}>리워드 받기</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{height: 8, backgroundColor: '#ececec', marginVertical: 4}}/>
                    <View style={{paddingHorizontal: 16}}>
                        <View 
                            style={[styles.flex_row, {paddingVertical: 24}]}
                        >
                            <Image
                                style={{width: 24, height: 24}}
                                width={24}
                                height={24}
                                source={require('../../Assets/ic_bid.png')}
                            />
                            <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 15, color: '#1e1e1e', marginLeft: 8, lineHeight: 24}}>
                                응찰목록
                            </Text>
                            <View style={{flex: 1}}/>
                            <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 16, color: '#909090', marginRight: 8, lineHeight: 24}}>
                                {(profileInfo && profileInfo.bidding) ? profileInfo.bidding : 0}
                            </Text>
                            {
                                profileInfo && profileInfo.bidding && profileInfo.bidding > 0 ?
                                    <TouchableOpacity
                                        style={{paddingHorizontal: 8, marginRight: -8}}
                                        onPress={()=>{navigation.push('BidHistoryScreen')}}
                                    >
                                        <Ionicons
                                            size={20}
                                            color={'#888888'}
                                            name={'chevron-forward'}
                                        />
                                    </TouchableOpacity>
                                : null
                            }
                        </View>
                        <View style={{height: 1, backgroundColor: '#f5f5f5'}}/>
                        <View 
                            style={[styles.flex_row, {paddingVertical: 24}]}
                        >
                            <Image
                                style={{width: 24, height: 24}}
                                width={24}
                                height={24}
                                source={require('../../Assets/ic_chart.png')}
                            />
                            <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 15, color: '#1e1e1e', marginLeft: 8, lineHeight: 24}}>기부기록</Text>
                            <View style={{flex: 1}}/>
                            <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 16, color: '#909090', marginRight: 8, lineHeight: 24}}>
                                {(profileInfo && profileInfo.total_amount) ? profileInfo.total_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : 0}원
                            </Text>
                            {
                                profileInfo && profileInfo.total_amount && profileInfo.total_amount > 0 ?
                                    <TouchableOpacity
                                        style={{paddingHorizontal: 8, marginRight: -8}}
                                        onPress={()=>{navigation.push('DonationHistoryScreen')}}
                                    >
                                        <Ionicons
                                            size={20}
                                            color={'#888888'}
                                            name={'chevron-forward'}
                                        />
                                    </TouchableOpacity>
                                : null
                            }
                        </View>
                        <View style={{height: 1, backgroundColor: '#f5f5f5'}}/>
                        <View style={[styles.flex_row, {paddingVertical: 24}]}>
                            <Image
                                style={{width: 24, height: 24}}
                                width={24}
                                height={24}
                                source={require('../../Assets/ic_heart_black.png')}
                            />
                            <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 15, color: '#1e1e1e', marginLeft: 8, lineHeight: 24}}>
                                관심목록
                            </Text>
                            <View style={{flex: 1}}/>
                            <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 16, color: '#909090', marginRight: 8, lineHeight: 24}}>
                                {(profileInfo && profileInfo.like) ? profileInfo.like.length : 0}
                            </Text>
                            {
                                profileInfo && profileInfo.like && profileInfo.like.length > 0 ?
                                    <TouchableOpacity
                                        style={{paddingHorizontal: 8, marginRight: -8}}
                                        onPress={()=>{navigation.push('FavoriteListScreen', {likes: profileInfo.like})}}
                                    >
                                        <Ionicons
                                            size={20}
                                            color={'#888888'}
                                            name={'chevron-forward'}
                                        />
                                    </TouchableOpacity>
                                : null
                            }
                        </View>
                        {
                            profileInfo && profileInfo.like && profileInfo.like.length > 0 ?
                            <ScrollView
                                style={{marginBottom: 24}}
                                horizontal={true}
                            >
                                {
                                    profileInfo.like.map((item, key) => {
                                        return _renderLikeItem(item, key)
                                    })
                                }                           
                            </ScrollView>
                            : null
                        }
                    </View>
                </ScrollView>
           </SafeAreaView>
           <PhotoSelectionModal
                okAction={onPressPhotoType}
                dismissAction={()=>{showPhotoSelection(false)}}
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
        user: state.global.user
    }
}

const mapDispatchToProps = {
    logout,
    setApiLoading,
    showAlert,
    showPhotoSelection,
    userUpdate
}

export default connect(
    mapStateToProps, 
    mapDispatchToProps
)(ProfileScreen);
