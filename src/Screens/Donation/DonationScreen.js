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
    ImageBackground
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'
import moment from 'moment';

import {setApiLoading} from '../../Redux/action/globalAction'
import {showAlert} from '../../Redux/action/AlertAction'
import APIKit from '../../Config/APIKit';

const DonationScreen = (props) => {
    const {navigation, setApiLoading, showAlert} = props

    const [donations, setDonations] = useState(null)
    const [keyword, setKeyword] = useState('')
    const [pageCnt, setPageCnt] = useState(0)
    const [page, setPage] = useState(null)

    useEffect(() => {
        if(page === null) {
            setPage(0)
            return
        }
        load_donations()
    }, [page])
    
    const load_donations = () => {
        if(page === null) {
            return
        }

        setApiLoading(true)
        const payload = {keys: keyword, start: 20*page, end: 1*page + 19}
        APIKit.post('campaigns/filter-list', payload)
        .then( (res) => {
            setApiLoading(false)
            const data = res.data
            if(!data) {
                return
            }

            console.log('campaigns/filter-list', data)
            const status = data.status
            setPageCnt(data.count)
            if(status === true) {
                setDonations(data.results)
            } else {
                showAlert({message: data.msg})
            }
        })
        .catch(error => {
            setApiLoading(false)
            console.log('campaigns/filter-list', error.message)
        })
    }
    
    const _renderItem = (item, key) => {
        console.log(item.organization)

        const onPressDetail = () => {
            navigation.push('CampaignDetailScreen', {campaign_id: item.id})
        }

        return(
            <TouchableOpacity
                key={key}
                style={{padding: 16}}
                onPress={onPressDetail}
            >
                <ImageBackground
                    style={{borderRadius: 4, height: 160, overflow: 'hidden', padding: 16}}
                    source={{uri: item.banner_image}}
                    resizeMode={'cover'}
                >
                    <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 18, color: '#ffffffcc', lineHeight: 24}}>{item.organization.name}</Text>
                    <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 14, color: '#ffffffcc', lineHeight: 24, marginTop: 6}}>{item.name}</Text>
                    <View style={{flex: 1}}/>
                    {/* <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 12, color: '#d0d0d0', lineHeight: 24}}>
                        {item.limit_time ? moment(item.limit_time).format('MM.DD') : '?????'} 까지
                    </Text> */}
                    <Image
                        style={{position: 'absolute', top: 8, right: 8, height: 48, width: 50, alignItems: 'flex-end'}}
                        resizeMode={'contain'}
                        source={{uri: item.organization.logo}}
                    />
                </ImageBackground>
            </TouchableOpacity>
        )
    }
    return (
        <View style={[styles.container]}>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={{flex: 1}}>
                <View style={styles.header}>
                    <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 18, color: '#1e1e1e'}}>기부하자</Text>
                </View>
                <View style={[styles.flex_row, {marginHorizontal: 16, marginTop: 4, marginBottom: 16, backgroundColor: '#f5f5f5', borderRadius: 4, borderWidth: 1, borderColor: '#ececec', height: 48}]}>
                    <TextInput
                        placeholder={'기부단체, 캠페인명을 검색해 보세요.'}
                        placeholderTextColor='#909090'
                        style={{marginHorizontal: 16, flex: 1}}
                        value={keyword}
                        onChangeText={(val) => {setKeyword(val)}}
                    />
                    <TouchableOpacity
                        onPress={() => {
                            load_donations()
                        }}
                    >
                        <Image
                            style={{width: 24, height: 24, marginRight: 16}}
                            width={24}
                            height={24}
                            source={require('../../Assets/ic_search.png')}
                        />
                    </TouchableOpacity>
                </View>
                <View style={{height: 8, backgroundColor: '#ececec'}}/>
                <ScrollView style={{flex: 1}}>
                    {
                        donations && donations.map((item, key) => {
                            return _renderItem(item, key)
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
    setApiLoading,
    showAlert
}

export default connect(
    mapStateToProps, 
    mapDispatchToProps
)(DonationScreen);
