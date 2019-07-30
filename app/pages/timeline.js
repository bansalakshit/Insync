
import React from 'react';
import { Row, Col, Tooltip } from 'reactstrap';
import { connect } from 'react-redux'
import { withRouter } from 'next/router'
import moment from 'moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretRight, faCaretLeft } from '@fortawesome/free-solid-svg-icons'

import Layout from '../components/layout'
import Screenshots from '../components/screenshots'

import { logActions } from '../actions'
import { logService } from '../services'
import { formatLog } from '../helpers'

class Timeline extends React.Component {

    constructor(props) {
        super(props)
        
        this.state = {
            date: moment(),
            activeDay: moment().format('YYYY-MM-DD'),
            tooltipDay: '',
            days: [],
            numDays: 0,
            monthLogs: []
        }

        this.prevMonth = this.prevMonth.bind(this)
        this.nextMonth = this.nextMonth.bind(this)
        this.currentDay = this.currentDay.bind(this)
        this.clickDay = this.clickDay.bind(this)
        this.hoverDay = this.hoverDay.bind(this)
        this.toggle = this.toggle.bind(this)
    }

    toggle() {
        this.setState({
            tooltipDay: ''
        })
    }

    hoverDay(_day) {
        this.setState({
            tooltipDay: _day
        })
    }

    componentDidMount() {
        this.rebuildBar()
        this.get()
    }

    get() {
        this.props.dispatch(logActions.getScreenshots(this.props.router.query.id, this.state.activeDay, this.state.activeDay))
    }

    rebuildBar() {
        setTimeout(() => {
            let firstDay = moment(this.state.date.startOf('month').format('YYYY-MM-DD'))
            let lastDay = moment(this.state.date.endOf('month').format('YYYY-MM-DD'))
            
            let days = []

            logService.month(this.props.router.query.id, firstDay.format('YYYY-MM-DD'), lastDay.format('YYYY-MM-DD'))
                .then(_results => {
                    this.setState({
                        monthLogs: _results
                    })
                })
                .catch(console.log)

            let pushDay = (_date) => {
                days.push({
                    date: _date.format('YYYY-MM-DD'),
                    dayNum: _date.format('D'),
                    dayAbbr: _date.format('ddd'),
                    isToday: _date.format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')
                })
            }
            
            let date = firstDay
            do {
                pushDay(date)
                date.add(1, 'day')
            } while(date <= lastDay)

            this.setState({
                numDays: lastDay.format('D'),
                days: days
            })
            this.get()
        }, 300)
    }

    getSeconds(_date) {
        let log = this.state.monthLogs.find(i=>i.date === _date)
        if(log)
            return log.seconds
        else
            return 0
    }

    prevMonth() {
        this.setState({
            date: this.state.date.subtract(1, 'month'),
            activeDay: this.state.date.subtract(1, 'month').endOf('month').format('YYYY-MM-DD'),
        })
        this.rebuildBar()
    }

    nextMonth() {
        this.setState({
            date: this.state.date.add(1, 'month'),
            activeDay: this.state.date.add(1, 'month').startOf('month').format('YYYY-MM-DD'),
        })
        this.rebuildBar()
    }

    currentDay() {
        this.setState({
            date: moment(),
            activeDay: moment().format('YYYY-MM-DD'),
        })
        this.rebuildBar()
    }

    clickDay(_day) {
        this.setState({
            activeDay: _day
        })
        this.rebuildBar()
    }

    dateStr() {
        return this.state.date.format('MMMM YYYY')
    }

    todayStr() {
        return moment(this.state.activeDay).format('ddd, MMMM D')
    }

    dayClassName(_dayAbbr) {
        return `day ${['Sat', 'Sun'].includes(_dayAbbr) ? 'weekend': ''}`
    }

    isToday(_isToday) {
        return `number ${_isToday ? 'today': ''}`
    }

    render() {
        return (
            <Layout private={true}>
                <Row>
                    <Col sm="12" className="page-content timeline">
                        <div className="time-bar">
                    
                            <div className="month-navigator">

                                <span className="pointer prev-month" onClick={this.prevMonth}>
                                    <FontAwesomeIcon icon={faCaretLeft}/>
                                </span>
                                <span className="current-month">{this.dateStr()}</span>
                                <span className="pointer next-month" onClick={this.nextMonth}>
                                    <FontAwesomeIcon icon={faCaretRight}/>
                                </span>
                        
                                <span className="pointer today text-primary" onClick={this.currentDay}>
                                    Today
                                </span>
                                
                            </div>

                            <div className="days-navigator">
                                <Row  className="m-0">
                                    {
                                        (()=>{
                                            if(this.state.days.length > 0) {
                                                return this.state.days.map((day, index) => {
                                                    return (
                                                        <React.Fragment key={index} >
                                                            <Col id={`tooltip-${day.date}`} className={this.dayClassName(day.dayAbbr) + ` ${day.date === this.state.activeDay ? 'active': ''}`} onClick={()=>{this.clickDay(day.date)}} onMouseOver={()=>{this.hoverDay(day.date)}}>
                                                                <div className="name">{day.dayAbbr}</div>
                                                                <div className={this.isToday(day.isToday)}>{day.dayNum}</div>
                                                            </Col>
                                                            <Tooltip placement="top" isOpen={this.state.tooltipDay === day.date} target={`tooltip-${day.date}`} toggle={this.toggle}>
                                                                {formatLog(this.getSeconds(day.date))}
                                                            </Tooltip>
                                                        </React.Fragment>
                                                    )
                                                })
                                            }
                                        })()
                                    }
                                </Row>
                            </div>
                            
                            
                            {
                                (()=> {
                                    if(this.props.loading) {
                                        return (
                                            <Row>
                                                <Col sm="12" className="text-center">Loading...</Col>
                                            </Row>
                                        )
                                    } else {
                                        return (

                                            <React.Fragment>
                                                <Row className="log-time">
                                                    <Col sm="12">
                                                        <h5>{this.todayStr()}</h5>
                                                        {
                                                            (()=>{
                                                                if(this.props.list && this.props.list.logs) {
                                                                    return (
                                                                        <h1>{formatLog(this.props.list.logs.seconds)}</h1>
                                                                    )
                                                                }
                                                            })()
                                                        }
                                                    </Col>
                                                </Row>
                                                <Row className="screenshots">
                                                {
                                                    (()=>{
                                                        if(this.props.list && this.props.list.logs && this.props.list.logs.screenshots && this.props.list.logs.screenshots.length > 0) {
                                                            return (
                                                                <Col sm="12">
                                                                    <Screenshots
                                                                        screenshots={this.props.list.logs.screenshots}
                                                                    />
                                                                </Col>
                                                            )
                                                        } else {
                                                            return (
                                                                <Col sm="12" className="text-center">No screenshots yet</Col>
                                                            )
                                                        }
                                                    })()
                                                }
                                                </Row>

                                            </React.Fragment>   
                                        )
                                    }
                                })()
                            }

                        </div>
                    </Col>
                </Row>
            </Layout>
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

export default withRouter(connect(mapStateToProps)(Timeline))