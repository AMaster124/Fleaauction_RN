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
    TextInput,
    ImageBackground,
    Dimensions,
    Linking
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'
import HTML from 'react-native-render-html'
import Carousel, {ParallaxImage, Pagination} from 'react-native-snap-carousel'

import {setApiLoading} from '../../Redux/action/globalAction'
import {showAlert} from '../../Redux/action/AlertAction'
import APIKit from '../../Config/APIKit';

const IS_IOS = Platform.OS === 'ios';

const mW = Dimensions.get('window').width
const wp = (percentage) => {
    const value = (percentage * mW) / 100;
    return Math.round(value);
}

const slideWidth = wp(75);
const slideHeight = slideWidth;
const itemHorizontalMargin = wp(2);

const sliderWidth = mW;
const itemWidth = slideWidth + itemHorizontalMargin * 2;

const CampaignDetailScreen = (props) => {
    const {navigation, setApiLoading, showAlert} = props
    const [campaign, setCampaign] = useState(null)
    const [images, setImages] = useState(null)
    const [activeSlide, setActiveSlide] = useState(1)
    let sliderRef = useRef("slider")

    useEffect(() => {
        if(navigation.state.params.campaign_id) {
            setApiLoading(true)
            const payload = {id: navigation.state.params.campaign_id}
            APIKit.post('campaigns/get-one', payload)
            .then( (res) => {
                setApiLoading(false)
                const data = res.data
                if(!data) {
                    return
                }

                const status = data.status
                if(status === true) {
                    console.log('campaigns/get-one', data.results.vote_state, navigation.state.params.campaign_id)
                    setCampaign(data.results)
                    if(data.results.campaign_images) {
                        setImages(JSON.parse(data.results.campaign_images))
                    }
                } else {
                    showAlert({message: data.msg})
                }
            })
            .catch(error => {
                setApiLoading(false)
                console.log('campaigns/get-one', error.message)
            })
        }
    }, [])

    const _renderImage = ({item, index}) => {
        const even = (index + 1) % 2 === 0;
        return (
            <View style={styles.slideInnerContainer}>
                <Image
                    source={{ uri: item.url }}
                    style={styles.image}
                />
            </View>
        );
    }

    const onPressVote = () => {
        setApiLoading(true)
        const payload = {campaign_id: campaign.id}
        APIKit.post('campaigns/vote', payload)
        .then( (res) => {
            setApiLoading(false)
            const data = res.data
            if(!data) {
                return
            }

            setCampaign({...campaign, vote_len: data.results, vote_state: data.status})
        })
        .catch(error => {
            setApiLoading(false)
            console.log('campaigns/vote', error.message)
        })
    }

    return campaign === null ? null : (
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
                    <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 18, color: '#1e1e1e'}}>기부 캠페인</Text>
                </View>
                <ScrollView style={{flex: 1}}>
                    <ImageBackground
                        style={[styles.center, {height: 340}]}
                        // source={{uri: 'http://www.newspower.co.kr/imgdata/newspower_co_kr/201608/201608315603626.jpg'}}
                        source={{uri: campaign.banner_image}}
                        resizeMode={'cover'}
                    >
                        <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#00000080'}}/>
                        <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 20, color: '#ffffff', lineHeight: 24}}>
                            {campaign.name}
                        </Text>
                        <View style={{marginVertical: 20, width: 52, height: 0.5, backgroundColor: '#ffffff'}}/>
                        <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 14, color: '#ffffff', lineHeight: 18}}>
                            {campaign.organization.name}
                        </Text>
                    </ImageBackground>
                    <View style={[styles.flex_row, {padding: 16}]}>
                        <View style={{flex: 1}}>
                            <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 20, color: '#1e1e1e', lineHeight: 32}}>{campaign.name}</Text>
                            <View style={[styles.flex_row, {marginTop: 12}]}>
                                <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 14, color: '#555555', lineHeight: 18}}>{campaign.organization.name}</Text>
                                {/* <View style={{height: 12, width: 1, backgroundColor: '#bababa', marginHorizontal: 8, lineHeight: 18}}/> */}
                                {/* <Text style={{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 14, color: '#555555', lineHeight: 18}}>11.30 까지</Text> */}
                            </View>
                        </View>
                        <TouchableOpacity
                            style={[styles.center, {
                                width: 56,
                                height: 56,
                                borderWidth: campaign.vote_state === true ? 0 : 1,
                                borderColor: '#bababa',
                                backgroundColor: campaign.vote_state === true ? '#04dea0' : 'white',
                                borderRadius: 200
                            }]}
                            onPress={onPressVote}
                        >
                            <Image
                                style={{width: 24, height: 24, tintColor: campaign.vote_state === true ? 'white' : '#bababa'}}
                                width={24}
                                height={24}
                                source={require('../../Assets/ic_thumbs_up.png')}
                            />
                            <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 12, color: campaign.vote_state === true ? 'white' : '#888888', lineHeight: 18}}>
                                {campaign.vote_len}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{height: 8, backgroundColor: '#ececec', marginTop: 8}}/>
                    <View style={{padding: 16, marginVertical: 8, overflow: 'visible'}}>
                        <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 18, color: '#1e1e1e', lineHeight: 24}}>캠페인 소개</Text>
                        <HTML 
                            source={{html: campaign.description || '<p></p>'}}
                            ignoredStyles={["font-family", "letter-spacing"]}
                        />
                        {
                            images ?
                            <View style={{marginHorizontal: -16}}>
                                <Carousel
                                    ref={sliderRef}
                                    layout={'default'}
                                    data={images}
                                    renderItem={_renderImage}
                                    sliderWidth={sliderWidth}
                                    itemWidth={itemWidth}
                                    hasParallaxImages={true}
                                    firstItem={1}
                                    inactiveSlideOpacity={0.7}
                                    inactiveSlideScale={0.9}
                                    containerCustomStyle={styles.slider}
                                    contentContainerCustomStyle={styles.sliderContentContainer}
                                    loop={true}
                                    loopClonesPerSide={2}
                                    enableMomentum={true}
                                    autoplay={true}
                                    autoplayDelay={500}
                                    autoplayInterval={3000}
                                    onSnapToItem={(index) => {setActiveSlide(index)}}
                                    // activeSlideAlignment={'start'}
                                    // activeAnimationType={'spring'}
                                    // activeAnimationOptions={{
                                    //     friction: 4,
                                    //     tension: 40
                                    // }}
                                />
                                <Pagination
                                    dotsLength={images.length}
                                    activeDotIndex={activeSlide}
                                    containerStyle={styles.paginationContainer}
                                    dotColor={'#1e1e1e'}
                                    dotStyle={styles.paginationDot}
                                    inactiveDotColor={'#808080'}
                                    inactiveDotOpacity={0.4}
                                    inactiveDotScale={0.6}
                                    carouselRef={sliderRef}
                                    tappableDots={!!sliderRef}
                                />
                            </View>
                            : null
                        }
                    </View>
                    <View style={{padding: 16, backgroundColor: '#ececec'}}>
                        <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 18, color: '#1e1e1e', marginTop: 8, lineHeight: 24}}>{campaign.organization.name} 소개</Text>
                        <HTML 
                            source={{html: campaign.organization.description || '<p></p>'}}
                            ignoredStyles={["font-family", "letter-spacing"]}
                        />
                        <TouchableOpacity 
                            style={[styles.center, {height: 56, borderRadius: 2, backgroundColor: '#ffffff',borderWidth: 1, marginTop: 16, borderColor: '#e0e0e0'}]}
                            onPress={()=>{
                                Linking.openURL(campaign.organization.url)
                            }}
                        >
                            <View style={styles.flex_row}>
                                <Text style={[{fontFamily: 'NotoSansCJKkr-Regular', fontSize: 15, color: '#1e1e1e'}]}>{campaign.organization.name} 홈페이지 </Text>
                                <Ionicons
                                    size={20}
                                    color={'#888888'}
                                    name={'chevron-forward'}
                                />
                            </View>
                        </TouchableOpacity>
                        <View style={{height: 8}}/>
                    </View>
                </ScrollView>
                {
                    campaign.auction ?
                        <TouchableOpacity 
                            style={[styles.center, {height: 64, backgroundColor: '#04dea0'}]}
                            onPress={()=>{
                                campaign.auction.role === 'live' ?
                                    navigation.push('LiveAuctionScreen', {id: campaign.auction.id})
                                :
                                    navigation.push('MultiAcutionScreen', {id: campaign.auction.id})
                            }}
                        >
                            <Text style={{fontFamily: 'NotoSansCJKkr-Medium', fontSize: 18, color: '#ffffff'}}>본 캠페인 후원 경매 바로가기</Text>
                        </TouchableOpacity>
                    : null
                }
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
    },
    imageContainer: {
        flex: 1,
        marginBottom: IS_IOS ? 0 : -1, // Prevent a random Android rendering issue
        backgroundColor: 'white',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8
    },
    imageContainerEven: {
        backgroundColor: '#1a1917'
    },
    image: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: 'cover',
        borderRadius: 16,
        height: slideHeight
    },
    sliderContentContainer: {
        paddingVertical: 10 // for custom animation
    },
    slider: {
        marginTop: 15,
        overflow: 'visible' // for custom animations
    },
    paginationContainer: {
        marginTop: -40,
        paddingVertical: 8
    },
    paginationDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#ffffff',
        marginHorizontal: 2
    },
    slideInnerContainer: {
        width: itemWidth,
        height: slideHeight,
        paddingHorizontal: itemHorizontalMargin,
        paddingBottom: 18 // needed for shadow
    },

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
)(CampaignDetailScreen);
