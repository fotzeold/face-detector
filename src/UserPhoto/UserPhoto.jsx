import { useState, useEffect } from "react";
import UserCamera from "../UserCamera/UserCamera";
import "./UserPhoto.scss";

const UserPhoto = ({ setVerifyStep, isUserPhoto }) => {
	const [proccesPhoto, setProccessPhoto] = useState(
		isUserPhoto ? "finish" : "borrower"
	);

	useEffect(() => {
		let proccesType = isUserPhoto ? "finish" : "borrower";

		setProccessPhoto(proccesType);
	}, [isUserPhoto]);

	useEffect(() => {
		if (proccesPhoto === "finish") {
			setVerifyStep("");
		}
	}, [proccesPhoto]);

	return (
		<section className="userPhoto">
			<div className="userPhoto__wrapper">
				<div className="userPhoto__part">
					{proccesPhoto === "borrower" && (
						<UserCamera
							proccesPhoto={proccesPhoto}
							setVerifyStep={setVerifyStep}
						/>
					)}
				</div>
			</div>
		</section>
	);
};

export default UserPhoto;
