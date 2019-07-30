import React from "react";
import Link from "next/link";

import LastActive from "./last-active";
import ProfileImage from "../user/profile-image";
import { formatLog } from "../../helpers";

const DashboardList = (props) => {
	return (
		<tbody>
			{(() => {
				if (props.list && props.list.length > 0) {
					return props.list.map(freelancer => {
						if (freelancer.user)
							return (
								<tr key={freelancer.user._id}>
									<td>
										<div className="profile-image">
                                            <ProfileImage 
                                                user={freelancer.user}
                                            />
										</div>
										<Link
											href={{
												pathname: "employee",
												query: {
													id: freelancer.user._id
												}
											}}
										>
											<a>
												{
													freelancer.user.profile
														.first_name
												}{" "}
												{
													freelancer.user.profile
														.last_name
												}
											</a>
										</Link>
									</td>
									<td>
										{(() => {
											if (freelancer.logs.lastActive) {
												return (
													<LastActive
														freelancerId={
															freelancer.user._id
														}
														time={
															freelancer.logs
																.lastActive.end
														}
														screenshot={
															freelancer.logs
																.lastActive
																.screenshots[0]
														}
													/>
												);
											}
										})()}
									</td>
									<td>{formatLog(freelancer.logs.today)}</td>
									<td>
										{formatLog(freelancer.logs.yesterday)}
									</td>
									<td>{formatLog(freelancer.logs.week)}</td>
									<td>{formatLog(freelancer.logs.month)}</td>
								</tr>
							);
					});
				} else {
					return (
						<tr>
							<td colSpan="6" className="text-center">
								No freelancers yet
							</td>
						</tr>
					);
				}
			})()}
		</tbody>
	);
}

export default DashboardList;
