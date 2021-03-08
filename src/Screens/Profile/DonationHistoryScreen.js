import React, {useState, useEffect, useRef} from 'react';
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
import Pie from 'react-native-pie'
import Share from 'react-native-share'
import ViewShot, {captureRef} from 'react-native-view-shot'

import DonationAlert from '../../Components/Alerts/DonationAlert';
import {setApiLoading} from '../../Redux/action/globalAction'
import {showAlert} from '../../Redux/action/AlertAction'
import APIKit from '../../Config/APIKit';

const DonationHistoryScreen = (props) => {
    const {navigation, setApiLoading, showAlert} = props

    const colors = ['#04dea0', '#6dfbbf', '#ffa600', '#A2CD3D', '#D2BD05']

    const [histories, setHistories] = useState(null)
    const [projects, setProjects] = useState(null)
    const [totalPrice, setTotalPrice] = useState(0)
    const [alert, setAlert] = useState(false)

    const [assignData, setAssignData] = useState(null)
    
    let viewRef = useRef("viewShot")

    useEffect(() => {
        loadDonationHistory()
    }, [])

    const loadDonationHistory = () => {
        setApiLoading(true)
        APIKit.post('auctions/donation-history')
        .then( (res) => {
            setApiLoading(false)
            const data = res.data
            if(!data) {
                return
            }

            const status = data.status
            if(status === true) {
                setProjects(data.results.campaigns)
                procHistories(data.results.organizations)
            } else {
                showAlert({message: data.msg})
            }
        })
        .catch(error => {
            setApiLoading(false)
            console.log('auctions/donation-history', error.message)
        })
    }

    const procHistories = (histories) => {
        let list = []
        let total = 0
        let sum = 0
        for(i = 0; i < histories.length; i++) {
            const item = histories[i]
            total = total + item.amount
        }

        if(total <= 0) {
            setHistories(null)
            return
        }

        for(i = 0; i < histories.length; i++) {
            const item = histories[i]
            let percent = 0
            if(i === histories.length-1) {
                percent = 100 - sum
            } else {
                percent = Math.ceil(item.amount * 100 / total)
            }
            sum = sum + percent
            const section = {percentage: percent, color: colors[i%colors.length], price: item.amount, name: item.name}
            list.push(section)
        }

        setHistories(list)
        setTotalPrice(total)
    }

    const _renderHistoryItem = (item, key) => {
        return (
            <View key = {key} style={[styles.flex_row, {paddingVertical: 8}]}>
                <View style={{width: 16, height: 16, borderRadius: 200, borderWidth: 4, borderColor: item.color}}/>
                <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 15, color: '#1e1e1e', marginLeft: 8, lineHeight: 24}}>{item.name}</Text>
                <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 15, color: '#3f9fe8', marginLeft: 8, flex: 1, lineHeight: 24}}>{item.percentage}%</Text>
                <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 16, color: '#1e1e1e', lineHeight: 24}}>
                    {item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원
                </Text>
            </View>
        )
    }

    const _renderProjectItem = (item, key) => {
        return (
            <TouchableOpacity 
                key = {key} 
                style={{backgroundColor: 'white', padding: 16, marginVertical: 8, borderRadius: 4}}
                onPress={() => onPressProjectDetail(item.id)}
            >
                <Image 
                    style={{height: 24, width: 80}}
                    height={24}
                    resizeMode={'contain'}
                    source={{uri: item.banner_image}}
                />
                <View style={[styles.flex_row, {marginTop: 8}]}>
                    <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 15, color: '#1e1e1e', flex: 1, lineHeight: 24}}>{item.name}</Text>
                    <Ionicons
                        size={16}
                        color={'#888888'}
                        name={'chevron-forward'}
                    />
                </View>
            </TouchableOpacity>
        )
    }

    const shareSingleImage = async (uri) => {
        const shareOptions = {
            title: '나의 기부기록',
            url: uri,
            failOnCancel: false,
          };
      
          try {
            const ShareResponse = await Share.open(shareOptions);
          } catch (error) {
            console.log('error: '.concat(getErrorString(error)));
          }
    }

    const onPressShare = () => {
        captureRef(viewRef, {
            format: 'jpg',
            quality: 1
        }).then(
            uri => {
                shareSingleImage(uri)
            }
        )
    }

    const onPressProjectDetail = (campain_id) => {
        setApiLoading(true)
        APIKit.post('auctions/get-donation-history', {campaign_id: campain_id})
        .then( (res) => {
            setApiLoading(false)
            const data = res.data
            if(!data) {
                return
            }

            const status = data.status
            if(status === true) {
                const assign = data.results
                if(assign.donations.length > 0) {
                    setAssignData(data.results)
                    setAlert(true)
                } else {
                    showAlert({message: "기부금은 사용중에 있습니다"})
                }
            } else {
                showAlert({message: data.msg})
            }
        })
        .catch(error => {
            setApiLoading(false)
            console.log('auctions/get-donation-history', error.message)
        })
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
                        onPress={onPressShare}
                    >
                        <Image
                            style={{width: 24, height: 24}}
                            width={24}
                            height={24}
                            source={require('../../Assets/ic_share.png')}
                        />
                    </TouchableOpacity>
                    <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 18, color: '#1e1e1e'}}>나의 기부기록</Text>
                </View>
                <View style={{width: '100%', height: 1, backgroundColor: '#ececec'}}/>
                <ScrollView style={{flex: 1}}>
                    <ViewShot ref={viewRef} >
                        <View style={[styles.center, {height: 320}]}>
                            {
                                histories !== null ?
                                    <Pie
                                        radius={122}
                                        innerRadius={80}
                                        sections={histories}
                                    >
                                    </Pie>
                                : null
                            }
                            <View style={[styles.center, {position: 'absolute', left: 0, top: 0, bottom: 0, right: 0}]}>
                                <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 14, color: '#555555', lineHeight: 18}}>전체 기부금액</Text>
                                <Text style={{fontFamily: 'NotoSansCJKkr-Bold', fontSize: 20, color: '#1e1e1e', lineHeight: 32}}>
                                    {totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원
                                </Text>
                            </View>
                        </View>
                        <View style={{marginHorizontal: 16, padding: 16, borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 4}}>
                        { 
                            histories && histories.map((item, key) => {
                                return _renderHistoryItem(item, key)
                            }) 
                        }
                        </View>
                        <View style={{paddingHorizontal: 16, paddingVertical: 32, backgroundColor: '#ececec', marginTop: 40}}>
                            <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 20, color: '#1e1e1e', lineHeight: 32}}>{`소중한 기부금은\n이렇게 사용되었어요`}</Text>
                            <View style={{height: 16}}/>
                            { 
                                projects && projects.map((item, key) => {
                                    return _renderProjectItem(item, key)
                                }) 
                            }
                        </View>
                    </ViewShot>
                </ScrollView>
           </SafeAreaView>
           {
                alert === true ? (
                    <DonationAlert
                        data={assignData}
                        confirnAction={()=>{}}
                        dismissAction={()=>setAlert(false)}
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
)(DonationHistoryScreen);
