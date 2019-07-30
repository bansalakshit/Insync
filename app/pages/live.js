import React from 'react'
import { connect } from 'react-redux'
import { Row, Col, Container } from 'reactstrap'
import { withRouter } from 'next/router'
import TimeAgo from 'react-timeago'
import englishStrings from 'react-timeago/lib/language-strings/en'
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle, faExpand } from '@fortawesome/free-solid-svg-icons'
import _ from 'lodash/collection'
import { isMobile, isBrowser } from 'react-device-detect'
import classnames from 'classnames'

import { Carousel, Button } from 'react-bootstrap'
import { logActions } from '../actions'
import LiveSidebar from '../components/sidebar'
import { userInfo } from '../helpers'
import Head from '../components/head'

const formatter = buildFormatter(englishStrings)

class Live extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            carouselHeight: {
                height: '0px'
            },
            index: 0,
            selectedUser: 0,
            loaded: false,
            isExpanded: false,
            expandedUser: null,
            isFullscreen: false,
            list: null,
            thumbnails: null
        }

        this.unexpand = this.unexpand.bind(this)
        this.expand = this.expand.bind(this)
        this.viewUser = this.viewUser.bind(this)
        this.viewImg = this.viewImg.bind(this)
        this.handleData = this.handleData.bind(this)
        this.handleKeyDown = this.handleKeyDown.bind(this)
    }

    handleData(_data) {
        try {
            let data = JSON.parse(_data)
            let index = this.state.list.findIndex(_el => {
                return _el._id === data._id
            })
            let list = this.state.list
            let screenshots = data.screenshots
            screenshots[0].user = data.profile
            if(list.length > 0)
                list[index].screenshots = data.screenshots
            else
                list[0].screenshots = data.screenshots

            this.setState({
                list: list
            })
        } catch(_err){
            console.log(_err)
        }
    }

    componentDidUpdate(prevProps) {
        if(prevProps.list !== this.props.list) {
            this.setState({
                list: _.sortBy(this.props.list, u => u.profile.first_name)
            })
        }
    }

    unexpand() {
        this.setState({
            expandedUser: null,
            isExpanded: false
        })
    }

    expand() {
        const user = (this.state.list && this.state.list.length > 0) ? this.state.list[this.state.selectedUser].profile : {}
        if((this.state.list && this.state.list.length > 0))
            user._id = this.state.list[this.state.selectedUser]._id
        this.setState({
            expandedUser: user,
            isExpanded: true
        })
    }

    componentWillMount() {
        this.viewUser(0)
    }

    fullscreen() {
        let elem = document.documentElement
        if(elem) {
                if (elem.requestFullscreen) {
                    elem.requestFullscreen().then(()=>this.resize(true)).catch(_err=>{})
                } else if (elem.mozRequestFullScreen) { 
                    elem.mozRequestFullScreen().then(()=>this.resize(true)).catch(_err=>{})
                } else if (elem.webkitRequestFullscreen) {
                    elem.webkitRequestFullscreen().then(()=>this.resize(true)).catch(_err=>{})
                } else if (elem.msRequestFullscreen) {
                    elem.msRequestFullscreen().then(()=>this.resize(true)).catch(_err=>{})
                }
        }
    }

    resize(_isFullscreen) {
        let latestScreenshotHeight = 125+15
        let usersListHeight = 140
        let windowHeight = _isFullscreen ? screen.height : window.innerHeight
        let carouselHeight = windowHeight - (usersListHeight + latestScreenshotHeight)
        this.setState({
            carouselHeight: {
                height: `${carouselHeight}px`
            },
            isFullscreen: _isFullscreen
        })
    }

    handleKeyDown(event) {
        let currentUser = this.state.selectedUser
        let maxUser = this.state.list.length - 1
        if(event.keyCode === 37) {
            // arrow left
            this.setState({
                selectedUser: ((currentUser) === 0) ? maxUser : currentUser - 1,
                index: 0
            })
        } else if(event.keyCode === 39) {
            // arrow right
            this.setState({
                selectedUser: (currentUser === maxUser) ? 0 : this.state.selectedUser + 1,
                index: 0
            })
        }
        if(this.state.isExpanded)
            setTimeout(() => {
                this.expand()
            }, 300)
    }

    componentDidMount() {
        this.get()
        this.resize(false)
        this.setState({
            loaded: true
        })

        let exitHandler = () => {
            if (!document.fullscreenElement && !document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
                this.resize(false)
                this.setState({
                    isFullscreen: false
                })
            }
        }
        document.addEventListener('fullscreenchange', exitHandler);
        document.addEventListener('webkitfullscreenchange', exitHandler);
        document.addEventListener('mozfullscreenchange', exitHandler);
        document.addEventListener('MSFullscreenChange', exitHandler);
        document.addEventListener("keydown", this.handleKeyDown);

        let user = userInfo()
        if(typeof emitter !== 'undefined' && user) {
            let client = emitter.connect({secure: true})
            client.on('connect', () => {
                client.subscribe({
                    key: user.profile.channel_key,
                    channel: `InSync/${user._id}/employee/+/latestScreenshots`
                })
            })
            client.on('message', _data => {
                this.handleData(_data.binary.toString())
            })
        }
    }

    get() {
        this.props.dispatch(logActions.getLive())
    }

    viewUser(_id) {
        this.setState({
            index: 0,
            selectedUser: _id
        })
        if(this.state.isExpanded)
            setTimeout(() => {
                this.expand()
            }, 300)
    }

    viewImg(_index) {
        this.setState({
            index: _index
        })
    }

    userClassName(_id) {
        return this.state.selectedUser === _id ? 'user active' : 'user'
    }

    render() {
        const user = (this.state.list && this.state.list.length > 0) ? this.state.list[this.state.selectedUser].profile : {}
        if((this.state.list && this.state.list.length > 0))
            user._id = this.state.list[this.state.selectedUser]._id
        const thumbnails = (this.state.list && this.state.list.length > 0) ? this.state.list[this.state.selectedUser].screenshots : []
        return (
            <React.Fragment>
                <Head />
                <Container fluid className="live-screenshots">
                    {
                        (()=> {
                            if(!this.state.isFullscreen && !isMobile) {
                                return (
                                    <span onClick={()=>{this.fullscreen(true)}} className="fullscreen"><FontAwesomeIcon icon={faExpand}/></span>
                                )
                            }
                        })()
                    }

                    {
                        (()=> {
                            if(this.state.isExpanded) {
                                return (
                                    <LiveSidebar
                                        jobId={(this.state.list[this.state.selectedUser].screenshots[this.state.index]).job._id}
                                        user={this.state.expandedUser}
                                        closeCallback={this.unexpand}
                                    />
                                )
                            }
                        })()
                    }
                    <Row>
                        {
                            (()=>{
                                if(this.props.loading) {
                                    return (
                                        <Col className="text-center">Loading...</Col>
                                    )
                                } else {
                                    if(this.state.list && this.state.list.length > 0) {
                                        return (
                                            <React.Fragment>
                                                <Col sm="12">
                                                    <Row className="latest-screenshots">
                                                        {
                                                            (()=>{
                                                                if(thumbnails && thumbnails.length > 0) {
                                                                    return thumbnails.map((thumbnail, index2) => {
                                                                        return (
                                                                            <Col className="text-center" xs="4" sm="2" key={index2}>
                                                                                <img className={classnames({ 'browser': isBrowser, 'mobile': isMobile })} onClick={()=>{this.viewImg(index2)}} src={thumbnail.screenshots[0] ? thumbnail.screenshots[0] : '/static/img/no-image-available.png'} />
                                                                            </Col>
                                                                        )
                                                                    })
                                                                }
                                                            })()
                                                        }
                                                    </Row>
                                                    <Row >
                                                        {
                                                            (()=> {
                                                                if(thumbnails && thumbnails.length > 0) {
                                                                    return (
                                                                        <Col sm="12" className="screenshot-carousel" style={this.state.carouselHeight}>
                                                                            <Carousel
                                                                                activeIndex={this.state.index}
                                                                                onSelect={()=>{}}
                                                                                indicators={false}
                                                                                controls={false}
                                                                                interval={null}
                                                                                wrap={false}
                                                                            >
                                                                                {
                                                                                    (()=>{
                                                                                        return thumbnails.map((thumbnail, index2) => {
                                                                                            return (
                                                                                                <Carousel.Item key={index2}>
                                                                                                    {
                                                                                                        (()=> {
                                                                                                            let images = ['/static/img/no-image-available.png']
                                                                                                            if(thumbnail.screenshots && thumbnail.screenshots.length > 0) {
                                                                                                                images = thumbnail.screenshots
                                                                                                            }

                                                                                                            if(images.length > 1) {
                                                                                                                return (
                                                                                                                    <Row className="m-0">
                                                                                                                        {
                                                                                                                            (() => {
                                                                                                                                return images.map((img, index) => {
                                                                                                                                    return (
                                                                                                                                        <Col className="m-0 p-0" key={index} xs="12" md="6">
                                                                                                                                            <img
                                                                                                                                                className="multiple"
                                                                                                                                                src={img}
                                                                                                                                                alt=""
                                                                                                                                            />
                                                                                                                                        </Col>
                                                                                                                                    )
                                                                                                                                })
                                                                                                                            })()
                                                                                                                        }
                                                                                                                    </Row>
                                                                                                                )
                                                                                                            } else {
                                                                                                                return (
                                                                                                                    <img
                                                                                                                        className={classnames('single', { 'browser': isBrowser, 'mobile': isMobile })}
                                                                                                                        src={images[0]}
                                                                                                                        alt=""
                                                                                                                    />
                                                                                                                )
                                                                                                            }

                                                                                                        })()
                                                                                                    }
                                                                                                    <Carousel.Caption>
                                                                                                        <span className="description">
                                                                                                            <span className="profile-image">
                                                                                                                <img src={user && user.img ? user.img : 'static/img/no-image.png'} />
                                                                                                                <span className={user && user.isOnline ? `text-success` : `text-warning`}><FontAwesomeIcon icon={faCircle}/></span>
                                                                                                            </span>
                                                                                                            {thumbnail.task}
                                                                                                        </span>
                                                                                                        <span className="time">
                                                                                                            <TimeAgo date={thumbnail.end} formatter={formatter} />

                                                                                                            <Button onClick={this.expand}>Expand</Button>
                                                                                                        </span>
                                                                                                    </Carousel.Caption>
                                                                                                </Carousel.Item>
                                                                                            )
                                                                                        })
                                                                                    })()
                                                                                }
                                                                            </Carousel>
                                                                        </Col>
                                                                    )
                                                                }
                                                            })()
                                                        }
                                                    </Row>
                                                </Col>
                                                <Col sm="12" className="user-list">
                                                        {
                                                            (()=>{
                                                                return this.state.list.map((user, index2) => {
                                                                    if(user.profile)
                                                                        return (
                                                                            <div className={this.userClassName(index2)} key={index2} onClick={()=>{this.viewUser(index2)}}>
                                                                                <div className="profile-image">
                                                                                    <img src={user.profile.img ? user.profile.img : 'static/img/no-image.png'} />
                                                                                    <span className={user.profile.isOnline ? `text-success` : `text-muted`}><FontAwesomeIcon icon={faCircle}/></span>
                                                                                </div>
                                                                                <p>{user.profile.first_name}</p>
                                                                            </div>
                                                                        )
                                                                })
                                                            })()
                                                        }
                                                </Col>            
                                            </React.Fragment>
                                        )
                                    } else {
                                        return (
                                            <Col className="text-center">No data yet...</Col>
                                        )
                                    }
                                }
                            })()
                        } 
                    </Row>
                </Container>
            </React.Fragment>
        )
    }

}

function mapStateToProps(state) {
    const { list, loading } = state.request
    return {
        list,
        loading
    }
}

export default withRouter(connect(mapStateToProps)(Live))