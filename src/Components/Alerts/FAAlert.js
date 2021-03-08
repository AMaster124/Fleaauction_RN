import React, {useState} from 'react';
import {connect} from 'react-redux';

import { 
    StyleSheet, 
    View,
    Image,
    Text,
    TouchableOpacity
} from 'react-native';

import {hideAlert} from '../../Redux/action/AlertAction'

const FAAlert = (props) => {
    const {
        isOpen,
        message,
        isConfirm,
        confirmTitle,
        cancelTitle,
        confirmAction,
        cancelAction,
        hideAlert,
    } = props

    if(isOpen == false) {
        return null
    }

    return (
        <View style={[styles.container, styles.center]}>
            <View style={{marginHorizontal: 24, backgroundColor: '#FFFFFF', paddingTop: 24, alignSelf: 'stretch', borderRadius: 4, overflow: 'hidden'}}>
                <View style={{paddingHorizontal: 24, alignItems: 'center'}}>
                    <Image
                        style={{width: 56, height: 56, alignSelf: 'center'}}
                        width={56}
                        height={56}
                        source={require('../../Assets/ic_bulb.png')}
                    />
                    <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 15, color: '#1e1e1e', textAlign: 'center', marginTop: 16, marginHorizontal: 24}}>
                        {message}
                    </Text>
                </View>
                <View style={[styles.flex_row, {height: 56, marginTop: 24}]}>
                    { isConfirm ?
                        <View style={{flex: 1}}>
                            <TouchableOpacity 
                                style={[styles.center, {height: '100%', backgroundColor: '#bababa'}]}
                                onPress={()=>{
                                    cancelAction()
                                    hideAlert()
                                }}
                            >
                                <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 16, color: '#ffffff'}}>{cancelTitle}</Text>
                            </TouchableOpacity>
                        </View>
                    : null
                    }
                    <View style={{flex: 2}}>
                        <TouchableOpacity 
                            style={[styles.center, {height: '100%', backgroundColor: '#04dea0'}]}
                            onPress={()=>{
                                confirmAction()
                                hideAlert()
                            }}
                        >
                            <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 16, color: '#ffffff'}}>{confirmTitle}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#000000CC",
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
        isOpen: state.alert.isOpen,
        message: state.alert.message,
        isConfirm: state.alert.isConfirm,
        confirmTitle: state.alert.confirmTitle,
        cancelTitle: state.alert.cancelTitle,
        confirmAction: state.alert.confirmAction,
        cancelAction: state.alert.cancelAction,
    }
}

const mapDispatchToProps = {
    hideAlert
}

export default connect(
    mapStateToProps, 
    mapDispatchToProps
)(FAAlert);
