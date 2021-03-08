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
    ImageBackground
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'
import * as Animatable from 'react-native-animatable';
import {setApiLoading, userUpdate_Local} from '../../Redux/action/globalAction'
import {showAlert} from '../../Redux/action/AlertAction'
import APIKit from '../../Config/APIKit';
import RewardOpenAlert from '../../Components/Alerts/RewardOpenAlert';

const RewardScreen = (props) => {
    const {navigation, setApiLoading, showAlert, userUpdate_Local, user} = props

    const [boxesLine1, setBoxesLine1] = useState(null)
    const [boxesLine2, setBoxesLine2] = useState(null)
    const [boxesLine3, setBoxesLine3] = useState(null)
    const [boxesLine4, setBoxesLine4] = useState(null)
    const [openModal, setOpenModal] = useState(false)
    const [rewards, setRewards] = useState(null)

    useEffect(() => {
        loadBoxes()
    }, [])

    const loadBoxes = () => {
        setApiLoading(true)
        APIKit.post('rewards/get-box-list')
        .then( (res) => {
            setApiLoading(false)
            const data = res.data
            if(!data) {
                return
            }

            const status = data.status
            if(status === true) {
                setBoxes(data.results)
                userUpdate_Local({num_olibs: data.user_olibs})

            } else {
                showAlert({message: data.msg})
            }
        })
        .catch(error => {
            setApiLoading(false)
            console.log('rewards/get-box-list', error.message)
        })
    }

    const setBoxes = (boxes) => {
        let line1 = []
        let line2 = []
        let line3 = []
        let line4 = []

        for( let i = 0; i < boxes.length; i++) {
            if(i < 3) {
                line1.push(boxes[i])
            } else if( i < 5) {
                line2.push(boxes[i])
            } else if( i < 8) {
                line3.push(boxes[i])
            } else if( i < 10) {
                line4.push(boxes[i])
            } else {
                break
            }
        }

        setBoxesLine1(line1)
        setBoxesLine2(line2)
        setBoxesLine3(line3)
        setBoxesLine4(line4)
    }

    const openBox = (item) => {
        setApiLoading(true)
        APIKit.post('rewards/reward-request', {box_id: item.id})
        .then( (res) => {
            setApiLoading(false)
            const data = res.data
            if(!data) {
                return
            }

            const status = data.status
            if(status === true) {
                setRewards(item.rewards)
                setOpenModal(true)
            } else {
                showAlert({message: data.msg})
            }
        })
        .catch(error => {
            setApiLoading(false)
            console.log('rewards/reward-request', error.message)
        })
    }

    const _renderActiveItem = (item, key) => {
        return (
            <TouchableOpacity 
                key={key}
                style={{width: 88, height: 80}}
                onPress={() => {openBox(item)}}
            >
                <View style={{alignSelf: 'center', width: 64, height: 64, borderWidth: 4, borderColor: '#17a47c', borderRadius: 200, backgroundColor: '#51545c', alignItems: 'center', justifyContent: 'flex-end'}}>
                    <Animatable.Image
                        style={{width: 52, height: 52, marginBottom: -4}}
                        width={52}
                        height={52}
                        source={require('../../Assets/ic_box_closed_active.png')}
                        animation="rubberBand"
                        easing="ease-out"
                        iterationCount="infinite"
                    />
                </View>
                <View style={[styles.flex_row, {position: 'absolute', height: 32, left: 0, bottom: 0, right: 0, borderWidth: 4, backgroundColor: '#ffe043', borderRadius: 200, borderColor: '#17a47c'}]}>
                    <Image
                        style={{width: 24, height: 24, marginLeft: 4}}
                        width={24}
                        height={24}
                        source={require('../../Assets/ic_olive_active.png')}
                    />
                    <View style={[styles.center, {flex: 1, marginRight: 4, height: '100%'}]}>
                        <View style={[styles.flex_row]}>
                            <Text style={{fontWeight: 'bold', fontSize: 18, color: '#118967'}}>
                                {item.olibs}
                            </Text>
                            <Text style={{fontFamily: 'NotoSansCJKkr-Bold', fontSize: 14, color: '#118967', marginLeft: 2}}>
                                개
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
    
    const _renderInactiveItem = (item, key) => {
        return (
            <View key={key} style={{width: 88, height: 80}}>
                <View style={{alignSelf: 'center', width: 64, height: 64, borderWidth: 4, borderColor: '#aeaeae', borderRadius: 200, backgroundColor: '#c5c5c5', alignItems: 'center', justifyContent: 'flex-end'}}>
                    <Image
                        style={{width: 52, height: 52, marginBottom: -4}}
                        width={52}
                        height={52}
                        source={require('../../Assets/ic_box_closed_inactive.png')}
                    />
                </View>
                <View style={[styles.flex_row, {position: 'absolute', height: 32, left: 0, bottom: 0, right: 0, borderWidth: 4, backgroundColor: '#ececec', borderRadius: 200, borderColor: '#aeaeae'}]}>
                    <Image
                        style={{width: 24, height: 24, marginLeft: 4}}
                        width={24}
                        height={24}
                        source={require('../../Assets/ic_olive_inactive.png')}
                    />
                    <View style={[styles.center, {flex: 1, marginRight: 4, height: '100%'}]}>
                        <View style={[styles.flex_row]}>
                            <Text style={{fontWeight: 'bold', fontSize: 18, color: '#888888'}}>
                                {item.olibs}
                            </Text>
                            <Text style={{fontFamily: 'NotoSansCJKkr-Bold', fontSize: 14, color: '#888888', marginLeft: 2}}>
                                개
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
    
    const _renderOpenItem = (item, key) => {
        return (
            <View key={key} style={{width: 88, height: 80}}>
                <View style={{alignSelf: 'center', width: 64, height: 64, borderWidth: 4, borderColor: '#17a47c', borderRadius: 200, backgroundColor: '#51545c', alignItems: 'center', justifyContent: 'flex-end'}}>
                    <Image
                        style={{width: 52, height: 52, marginBottom: -4}}
                        width={52}
                        height={52}
                        source={require('../../Assets/ic_box_open.png')}
                    />
                    <View
                        style={{position: 'absolute', top: -4, bottom: -4, left: -4, right: -4, backgroundColor: '#ffffff66', borderRadius: 200}}
                    />
                </View>
                <View style={[styles.flex_row, {position: 'absolute', height: 32, left: 0, bottom: 0, right: 0, borderWidth: 4, backgroundColor: '#ffe043', borderRadius: 200, borderColor: '#17a47c'}]}>
                    <Image
                        style={{width: 24, height: 24, marginLeft: 4}}
                        width={24}
                        height={24}
                        source={require('../../Assets/ic_olive_inactive.png')}
                    />
                    <View style={[styles.center, {flex: 1, height: '100%', marginRight: 4}]}>
                        <View style={[styles.flex_row]}>
                            <Text style={{fontWeight: 'bold', fontSize: 18, color: '#118967'}}>
                                {item.olibs}
                            </Text>
                            <Text style={{fontFamily: 'NotoSansCJKkr-Bold', fontSize: 14, color: '#118967', marginLeft: 2}}>
                                개
                            </Text>
                        </View>
                    </View>
                    <View
                        style={{position: 'absolute', top: -4, bottom: -4, left: -4, right: -4, backgroundColor: '#ffffff66', borderRadius: 200}}
                    />
                </View>
            </View>
        )
    }

    const _renderItem = (item, key) => {
        if(item.user_open_state === true) {
            return _renderOpenItem(item, key)
        } else {
            if(user.num_olibs > item.olibs) {
                return _renderActiveItem(item, key)
            } else {
                return _renderInactiveItem(item, key)
            }
        }
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
                    <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 18, color: '#1e1e1e'}}>리워드</Text>
                </View>
                <ImageBackground
                    style={{width: '100%', flex: 1, alignItems: 'center'}}
                    resizeMode={'stretch'}
                    source={require('../../Assets/img_bg_reward.png')}
                >
                    <View style={[{alignItems: 'center', marginTop: 24}]}>
                        <View 
                            style={[styles.shadow, styles.flex_row, {height: 48, backgroundColor: '#17a47c', borderRadius: 200}]}
                            blurRadius={5}
                        >
                            <View style={[styles.center, styles.shadow, {height: 40, width: 40, backgroundColor: '#ffe043', borderRadius: 200, marginLeft: 4, borderColor: '#17a47c', borderWidth: 1}]}>
                                <Image
                                    style={{width: 32, height: 32}}
                                    width={32}
                                    height={32}
                                    source={require('../../Assets/ic_olive.png')}
                                />
                            </View>
                            <View style={[styles.center, {paddingLeft: 8, paddingRight: 16}]}>
                                <View style={[styles.flex_row]}>
                                    <Text style={{fontWeight: 'bold', fontSize: 24, color: '#ffffff'}}>
                                        {(user && user.num_olibs) ? user.num_olibs : 0}
                                    </Text>
                                    <Text style={{fontFamily: 'NotoSansCJKkr-Bold', fontSize: 20, color: '#ffffff', marginLeft: 2}}>
                                        개
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <View style={{marginTop: 8}}>
                            <View style={[styles.flex_row, {width: 220, marginTop: 16, paddingVertical: 8, paddingHorizontal: 12, borderWidth: 4, borderColor: '#04dea0', borderRadius: 20, backgroundColor: '#ffffff'}]}>
                                <View style={[styles.center, {width: 48, height: 48, backgroundColor: '#04dea0', borderRadius: 200}]}>
                                    <Image
                                        style={{width: 28, height: 28, tintColor: '#ffffff'}}
                                        width={28}
                                        height={28}
                                        resizeMode='contain'
                                        source={require('../../Assets/logo.png')}
                                    />
                                </View>
                                <Text style={{fontFamily: 'NotoSansCJKkr-Bold', flex: 1, marginLeft: 4, fontSize: 14, color: '#48423f', lineHeight: 24}}>
                                    {`올리브를 사용하여\n보물상자를 열어보세요`}
                                </Text>
                            </View>
                            <View style={[styles.triangle]} />
                            <View style={[styles.triangle_in]} />
                        </View>
                    </View>
                    {
                        boxesLine1 ?
                            <View style={[styles.flex_row, styles.item_line, {top: '39%', justifyContent: 'space-between'}]}>
                                {
                                    boxesLine1.map((item, key) => {
                                        return _renderItem(item, key)
                                    })
                                }
                            </View>
                        : null
                        
                    }
                    {
                        boxesLine2 ?
                            <View style={[styles.flex_row, styles.item_line, {top: '55%', justifyContent: 'space-evenly'}]}>
                                {
                                    boxesLine2.map((item, key) => {
                                        return _renderItem(item, key)
                                    })
                                }
                            </View>
                        : null
                        
                    }
                    {
                        boxesLine3 ?
                            <View style={[styles.flex_row, styles.item_line, {top: '71%', justifyContent: 'space-between'}]}>
                                {
                                    boxesLine3.map((item, key) => {
                                        return _renderItem(item, key)
                                    })
                                }
                            </View>
                        : null
                        
                    }
                    {
                        boxesLine4 ?
                            <View style={[styles.flex_row, styles.item_line, {top: '87%', justifyContent: 'space-evenly'}]}>
                                {
                                    boxesLine4.map((item, key) => {
                                        return _renderItem(item, key)
                                    })
                                }
                            </View>
                        : null
                        
                    }
                </ImageBackground>
            </SafeAreaView>
            {
                openModal ?
                    <RewardOpenAlert
                        rewards={rewards ? rewards : null}
                        confirnAction={()=>{loadBoxes()}}
                        dismissAction={()=>setOpenModal(false)}
                    />
                : null
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
        shadowColor: '#0000004e',
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 5,
    },
    center: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    triangle: {
        width: 0,
        height: 0,
        position: 'absolute',
        left: 98,
        top: 0,
        backgroundColor: "transparent",
        borderStyle: "solid",
        borderLeftWidth: 12,
        borderRightWidth: 12,
        borderBottomWidth: 16,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderBottomColor: "#04dea0",
    },
    triangle_in: {
        width: 0,
        height: 0,
        position: 'absolute',
        left: 101,
        top: 7,
        backgroundColor: "transparent",
        borderStyle: "solid",
        borderLeftWidth: 9,
        borderRightWidth: 9,
        borderBottomWidth: 13,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderBottomColor: "#ffffff",
    },
    item_line: {
        position: 'absolute', 
        left: '16%', 
        right: '16%', 
        marginHorizontal: -45,
        marginTop: -32,
    },
})

const mapStateToProps = state => {
    return {
        user: state.global.user
    }
}

const mapDispatchToProps = {
    setApiLoading,
    showAlert,
    userUpdate_Local
}

export default connect(
    mapStateToProps, 
    mapDispatchToProps
)(RewardScreen);
