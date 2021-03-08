import React, { } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image } from "react-native"
import {connect} from 'react-redux';


const FALoading = (props) => {
    const {
        apiLoading,
    } = props

    if( apiLoading ) {
    // if( true ) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#20006f88" />
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
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#00000044",
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
    },
    body_container: {
        width: '100%',
        padding: 40,
        shadowColor: '#555',
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 1,
        shadowRadius: 6,
        elevation: 5
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
        apiLoading: state.global.apiLoading,
    }
}

const mapDispatchToProps = {
}

export default connect(
    mapStateToProps, 
    mapDispatchToProps
)(FALoading);
