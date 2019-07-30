import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { Button } from 'reactstrap';

class AlertMessage extends PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            show: false,
        }

        this.close = this.close.bind(this);
    }

    componentDidUpdate(prevProps, prevStates) {
        if(this.props.alert !== prevProps.alert) {
            this.setState({
                show: this.props.alert && this.props.alert.type
            })
            if(this.props.alert && this.props.alert.type) {
                var self = this;
                setTimeout(() => {
                    self.close();
                }, 5000);
            }
        }
    }

    close() {
        this.setState({
            show: false
        })
    }

    render() {
        if(this.state.show) {
            return (
                    <div className='alert-container'>
                        {(()=>{
                            if(this.props.alert.message) {
                                return (
                                    <div className={`alert row mt-1 ${this.props.alert.type}`}>
                                            <div className="col-md-12">
                                                {
                                                    (()=>{
                                                        if(typeof this.props.alert.message === 'object') {
                                                            return this.props.alert.message.map((msg, index) => {
                                                                return (
                                                                    <div key={index}>{msg.description}</div>
                                                                )
                                                            })
                                                        } else {
                                                            return (
                                                                <span>{ this.props.alert.message}</span>
                                                            )
                                                        }
                                                    })()
                                                }
                                                <Button className="float-right" onClick={this.close}>Close</Button>
                                            </div>
                                    </div>
                                )
                            }
                        })()}
                    </div>
            )
        } else {
            return('')
        }
    }

}


function mapStateToProps(state) {
    const { alert } = state;
    return {
        alert
    };
}

export default connect(mapStateToProps)(AlertMessage);