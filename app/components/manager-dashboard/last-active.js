import React from "react";
import Link from "next/link";
import TimeAgo from "react-timeago";
import englishStrings from "react-timeago/lib/language-strings/en";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";
const formatter = buildFormatter(englishStrings);

const LastActive = (props) => {
	return (
		<Link
			href={{ pathname: "timeline", query: { id: props.freelancerId } }}
		>
			<a>
				<div className="last-active">
					<span>
						<TimeAgo date={props.time} formatter={formatter} />
					</span>
					<img
						src={
							props.screenshot
								? props.screenshot
								: "/static/img/no-image-available.png"
						}
					/>
				</div>
			</a>
		</Link>
	);
}

export default LastActive;
