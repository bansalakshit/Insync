import React from "react";
import { connect } from "react-redux";
import { Row, Col, Table } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faCaretUp,
    faCaretDown
} from "@fortawesome/free-solid-svg-icons";
import { logActions } from "../../actions";
import { userInfo } from "../../helpers";
import DashboardList from "./list";

class ManagerDashboard extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			sortDir: "ASC",
			userId: null,
			list: null
		};

		this.sort = this.sort.bind(this);
		this.handleData = this.handleData.bind(this);
	}

	handleData(_data) {
		try {
			let data = JSON.parse(_data);
			console.log("latest logs event");
			let index = this.state.list.findIndex(_el => {
				return _el.user._id === data.user._id;
			});
			let list = this.state.list;
			list[index].lastActive = data.lastActive;
			list[index].logs = data.logs;
			list[index].user = data.user;
			this.setState({
				list: list
			});
		} catch (_err) {
			console.log(_err);
		}
	}

	sort() {
		let newDir = this.state.sortDir === "DESC" ? "ASC" : "DESC";
		this.setState({
			sortDir: newDir
		});
		this.props.dispatch(logActions.getList(newDir));
	}

	componentDidMount() {
		this.props.dispatch(logActions.getList(this.state.sortDir));
		let user = userInfo();
		if (typeof emitter !== "undefined" && user) {
			let client = emitter.connect({ secure: true });
			client.on("connect", () => {
				client.subscribe({
					key: user.profile.channel_key,
					channel: `InSync/${user._id}/employee/+/latestLogTime`
				});
			});
			client.on("message", _data => {
				if (_data.binary) this.handleData(_data.binary.toString());
			});
		}
	}

	componentDidUpdate(prevProps) {
		if (prevProps.list !== this.props.list) {
			this.setState({
				list: this.props.list
			});
		}
	}

	render() {
		return (
			<Row className="page-content old-dashboard">
				<Col sm="12" lg="12">
					<h2>Manager Dashboards</h2>
				</Col>
				{(() => {
					if (this.props.loading) {
						return (
							<Col className="text-center" sm="12">
								Loading...
							</Col>
						);
					} else {
						return (
							<Col sm="12">
								<Table>
									<thead>
										<tr>
											<th>Employee</th>
											<th>
												<span
													className="pointer"
													onClick={this.sort}
												>
													Last Active{" "}
													{(() => {
														if (
															this.state
																.sortDir ===
															"DESC"
														)
															return (
																<FontAwesomeIcon
																	icon={
																		faCaretDown
																	}
																/>
															);
														else
															return (
																<FontAwesomeIcon
																	icon={
																		faCaretUp
																	}
																/>
															);
													})()}
												</span>
											</th>
											<th>Today</th>
											<th>Yesterday</th>
											<th>This Week</th>
											<th>This Month</th>
										</tr>
									</thead>
                                    <DashboardList 
                                        list={this.state.list}
                                    />
								</Table>
							</Col>
						);
					}
				})()}
			</Row>
		);
	}
}

function mapStateToProps(state) {
	const { list, loading } = state.dashboard;
	return {
		list,
		loading
	};
}

export default connect(mapStateToProps)(ManagerDashboard);
