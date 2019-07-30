import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { Container, Button } from 'reactstrap';

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
                <Container fluid className='alert-container'>
                    <Container>
                        {(()=>{
                            if(this.props.alert.message) {
                                return (
                                    <div className={`alert row mt-1 ${this.props.alert.type}`}>
                                            <div className="col-md-11">
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
                                            </div>
                                            <div className="col-md-1">
                                                <Button onClick={this.close}>Close</Button>
                                            </div>
                                    </div>
                                )
                            }
                        })()}
                    </Container>
                </Container>
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