import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Image, LogBox } from "react-native"
import {connect} from 'react-redux';
import { TouchableHighlight, TouchableOpacity } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

let height = 200

const PhotoSelectionModal = (props) => {
    const {navigation, isOpen, okAction, dismissAction} = props

    const [show, setShow] = useState(false)
    const [selIndex, setSelIndex] = useState(0)
    const [bottomHeight] = useState(new Animated.Value(0))

    LogBox.ignoreLogs(['Animated: `useNativeDriver`'])

    useEffect(()=>{
        if(isOpen) {
            setShow(true)
            Animated.timing(bottomHeight, {
                toValue: -height,
                duration: 300,
                useNativeDriver: true
            }).start()
        } else {
            Animated.timing(bottomHeight, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true
            }).start(()=>{setShow(false);})
        }
    }, [isOpen])

    const _okHandler = (filterType) => {
        setSelIndex(filterType)
        okAction(filterType);
        dismissAction();
    }

    if( show ) {
        // const height = 400*bgOpacity/0.5
        return (
            <View style={styles.container}>
                <Animated.View style={[{flex: 1, backgroundColor: "#000000", opacity: 0.8}]}>
                    <View style={{flex: 1, width: '100%'}}>
                        <TouchableHighlight onPress = {dismissAction} style={{height: '100%', width: '100%'}}>
                            <View/>
                        </TouchableHighlight>
                    </View>
                </Animated.View>
                <Animated.View style={[styles.body_container, {height: height, transform: [{ translateY: bottomHeight }]}]}>
                    <View style={[styles.center, {height: 56, backgroundColor: '#ececec'}]}>
                        <View 
                            style={[styles.center, {position: 'absolute', top: 0, right: 0, bottom: 0}]}
                        >
                            <TouchableOpacity 
                                style={{paddingHorizontal: 16}}
                                onPress={dismissAction}
                            >
                                <MaterialCommunityIcons name='close' size={24} color={'#1e1e1e'}/>
                            </TouchableOpacity>
                        </View>
                        <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 18, color: '#1e1e1e'}}>사진 선택</Text>
                    </View>
                    <TouchableOpacity 
                        onPress = {()=>{_okHandler(0)}} 
                        style={[styles.filter_item, {borderColor: selIndex === 0 ? '#04dea0' : '#ececec'}]}
                    >
                        <Image
                            style={{width: 24, height: 24}}
                            width={24}
                            height={24}
                            source={selIndex === 0 ? require('../../Assets/ic_radio_on.png') : require('../../Assets/ic_radio_off.png')}
                        />
                        <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 15, color: selIndex === 0 ? '#1e1e1e' : '#909090', marginLeft: 8}}>
                            촬영
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress = {()=>{_okHandler(1)}} 
                        style={[styles.filter_item, {borderColor: selIndex === 1 ? '#04dea0' : '#ececec'}]}
                    >
                        <Image
                            style={{width: 24, height: 24}}
                            width={24}
                            height={24}
                            source={selIndex === 1 ? require('../../Assets/ic_radio_on.png') : require('../../Assets/ic_radio_off.png')}
                        />
                        <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 15, color: selIndex === 1 ? '#1e1e1e' : '#909090', marginLeft: 8}}>
                            앨범
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
        </View>
        );
        
    } else {
        return null
    }
}

const styles = StyleSheet.create({
    center: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex'
    },
    body_container: {
        position: 'absolute',
        bottom: -height,
        left: 0,
        width: '100%', 
        backgroundColor: 'white', 
        borderTopLeftRadius: 16, 
        borderTopRightRadius: 16, 
        overflow: 'hidden',
        marginTop: -20,
        height: height
    },
    filter_item: {
        height: 48,
        borderRadius: 4,
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        paddingHorizontal: 16,
        marginTop: 12
    },
    flex_row: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    flex_row_reverse: {
        flexDirection: "row-reverse",
        alignItems: 'center'
    },
    shadow: {
        shadowColor: '#555',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.3,
        shadowRadius: 1,
        elevation: 5
    },
})

const mapStateToProps = state => {
    return {
        isOpen: state.modal.showPhotoSelection,
    }
}

const mapDispatchToProps = {
}

export default connect(
    mapStateToProps, 
    mapDispatchToProps
)(PhotoSelectionModal);
