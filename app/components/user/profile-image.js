import React, { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCircle
} from "@fortawesome/free-solid-svg-icons";

import { userService } from "../../services";

const ProfileImage = props => {
	const fileInput = useRef(null);
	const [imgUrl, setImgUrl] = useState(
		props.user.profile.img
			? props.user.profile.img
			: "static/img/no-image.png"
	);

	const getBase64 = file => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			reader.onerror = error => reject(error);
		});
	};

	const handleselectedFile = e => {
		getBase64(e.target.files[0])
			.then(_data => {
				return userService.updateProfileImage({
					userId: props.user._id,
					image: _data
				});
			})
			.then(_res => {
				setImgUrl(_res.url);
			});
	};

	const upload = () => {
		fileInput.current.click();
	};

	return (
		<React.Fragment>
			<img
				onClick={() => {
					upload(props.user._id);
				}}
				src={imgUrl}
			/>
			<span
				className={
					props.user.profile.isOnline
						? `text-success`
						: `text-muted`
				}
			>
				<FontAwesomeIcon icon={faCircle} />
			</span>
			<input
				onChange={handleselectedFile}
				style={{ width: "0px", height: "0px" }}
				ref={fileInput}
				type="file"
			/>
		</React.Fragment>
	);
};

export default ProfileImage;
