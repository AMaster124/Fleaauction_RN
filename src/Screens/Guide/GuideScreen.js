import React, {useState, useRef} from 'react';
import {connect} from 'react-redux';
import {ScrollView} from 'react-native'

import { 
    StyleSheet, 
    View,
    Image,
    SafeAreaView,
    TouchableOpacity,
    Text,
    Dimensions,
    StatusBar
} from 'react-native';

import {
    setGuide,
} from '../../Redux/action/globalAction'
import AsyncStorage from '@react-native-community/async-storage';

const GuideScreen = (props) => {
    const {setGuide} = props

    const [page, setPage] = useState(0);
    let scrollRef = useRef("scrollRef")

    const itemWidth = Dimensions.get('window').width
    const guides = [
        {src: require('../../Assets/img_guide_first.png'), title: "참여하기", content: "갖고싶은 물건이 있다면\n실시간 옥션에 참여하기"},
        {src: require('../../Assets/img_guide_second.png'), title: "기부하기", content: "최종 낙찰자가 되면,\n결제와 기부를 동시에!"},
        {src: require('../../Assets/img_guide_third.png'), title: "인증하기", content: "기부금 영수증 발행과\n사용 내역 확인도 여기서!"}
    ]

    const handleScroll = (e) => {
        const x = e.nativeEvent.contentOffset.x
        const currentPage = Math.ceil(x / itemWidth)
        if(currentPage !== page) {
            setPage(currentPage)
        }
    }

    const _handlerNextPage = () => {
        if(page < 2) {
            scrollRef.current.scrollTo({x: (page+1)*itemWidth, animated: true})
        } else {
            AsyncStorage.setItem('guide_passed', 'true')
            setGuide(false)
        }
    }

    const _handlerSkipGuide = () => {
        setGuide(false)
    }

    const _renderGuideItem = (item, index) => {
        return (
            <View key={index} style={{width: itemWidth, height: '100%'}}>
                <View style={[styles.center, {flex: 1}]}>
                    <Image
                        style={{width: '80%'}}
                        resizeMode={'contain'}
                        source={item.src}
                    />
                </View>
                <View style={{alignSelf: 'center', alignItems: 'center', marginBottom: 40}}>
                    <Text style={{fontFamily: 'NotoSansCJKkr-Bold', fontSize: 20, color: '#1e1e1e'}}>{item.title}</Text>
                    <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 16, color: '#1e1e1e', marginTop: 16, textAlign: 'center'}}>{item.content}</Text>
                </View>
            </View>
        )
    }

    return (
        <View style={[styles.container, styles.center]}>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={{flex: 1}}>
                <ScrollView
                    ref={scrollRef}
                    style={{flex: 1}}
                    horizontal={true}
                    pagingEnabled={true}
                    showsHorizontalScrollIndicator={false}
                    scrollEventThrottle={15}
                    onScroll={handleScroll}
                    bounces={false}
                >
                    {
                        guides.map((item, key) => {
                            return _renderGuideItem(item, key)
                        })
                    }
                </ScrollView>
                <View style={[styles.flex_row, {alignSelf: 'center', paddingBottom: 50}]}>
                    <View style={{width: page === 0 ? 20 : 8, height: 8, backgroundColor: page === 0 ? '#04dea0' : '#bababa', borderRadius: 10}}/>
                    <View style={{width: page === 1 ? 20 : 8, height: 8, backgroundColor: page === 1 ? '#04dea0' : '#bababa', borderRadius: 10, marginLeft: 8}}/>
                    <View style={{width: page === 2 ? 20 : 8, height: 8, backgroundColor: page === 2 ? '#04dea0' : '#bababa', borderRadius: 10, marginLeft: 8}}/>
                </View>
                <View style={{height: 1, backgroundColor: '#ECECEC'}}/>
                <View style={[styles.flex_row, {height: 80, width: '100%'}]}>
                    <TouchableOpacity 
                        style={[styles.center, {height: '100%', flex: 1}]}
                        onPress={_handlerSkipGuide}
                    >
                        <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 16, color: '#909090'}}>나중에 보기</Text>
                    </TouchableOpacity>
                    <View style={{height: '100%', width: 1, backgroundColor: '#ECECEC'}}/>
                    <TouchableOpacity
                        style={[styles.center, {height: '100%', flex: 1,}]}
                        onPress={_handlerNextPage}
                    >
                        <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 16, color: '#1e1e1e'}}>다음</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#FFFFFF",
        flex: 1,
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
    setGuide,
}

export default connect(
    mapStateToProps, 
    mapDispatchToProps
)(GuideScreen);
