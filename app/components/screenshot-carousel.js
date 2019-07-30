import React, { Component } from 'react'
import moment from 'moment'
import {
    Carousel,
    CarouselItem,
    CarouselControl,
    CarouselIndicators,
    CarouselCaption
} from 'reactstrap'

class ScreenshotCarousel extends Component {
    constructor(props) {
        super(props)
        this.state = { activeIndex: 0, items: [] }
        this.next = this.next.bind(this)
        this.previous = this.previous.bind(this)
        this.goToIndex = this.goToIndex.bind(this)
        this.onExiting = this.onExiting.bind(this)
        this.onExited = this.onExited.bind(this)
    }

    componentWillMount() {
        let items = []
        let count = 0
        this.props.items.forEach(item => {
            item.screenshots.forEach(img => {
                items.push({
                    src: img,
                    altText: '',
                    caption: moment(item.start).format('LLL'),
                    header: `${item.job.title} - ${item.task ? item.task : 'No Task'}`
                })
                if(img === this.props.active)
                    this.setState({activeIndex: count})
                count++
            })
        })

        this.setState({
            items: items
        })

    }

    render() {
        return(
            <h1>hello world</h1>
        )
    }

    onExiting() {
        this.animating = true
    }

    onExited() {
        this.animating = false
    }

    next() {
        if (this.animating) return;
        const nextIndex = this.state.activeIndex === this.state.items.length - 1 ? 0 : this.state.activeIndex + 1
        this.setState({ activeIndex: nextIndex })
    }

    previous() {
        if (this.animating) return;
        const nextIndex = this.state.activeIndex === 0 ? this.state.items.length - 1 : this.state.activeIndex - 1
        this.setState({ activeIndex: nextIndex })
    }

    goToIndex(newIndex) {
        if (this.animating) return
        this.setState({ activeIndex: newIndex })
    }

    render() {
        const { activeIndex } = this.state

        const slides = this.state.items.map(item => {
                return (
                    <CarouselItem
                        onExiting={this.onExiting}
                        onExited={this.onExited}
                        key={item.src}
                    >
                        <img src={item.src} alt={item.altText} />
                    </CarouselItem>
                )
        })

        return (
            <div className="carousel-container">
                <Carousel
                    className="carousel test"
                    activeIndex={activeIndex}
                    next={this.next}
                    previous={this.previous}
                    interval={false}
                >
                    {slides}
                </Carousel>
            </div>
        )
    }
}


export default ScreenshotCarousel