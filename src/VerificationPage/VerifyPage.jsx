import "./VerifyPage.scss";
import UserPhoto from "../UserPhoto/UserPhoto";
import { useState, useEffect } from "react";

const VerifyPage = () => {
	const [verifyStep, setVerifyStep] = useState("");

	const handleChangeScreen = (step) => {
		setVerifyStep(step);
	};

	const isUserPhoto = false;

	return (
		<main className="VerifyPage">
			<div className="VerifyPage__container">
				<div className="VerifyPage__wrapper">
					{!verifyStep && (
						<>
							<h1>VerifyPage</h1>
							<div className="VerifyPage__buttons">
								{!isUserPhoto && (
									<button onClick={() => handleChangeScreen("user-photo")}>
										User Photo
									</button>
								)}
							</div>
						</>
					)}

					{verifyStep === "user-photo" && (
						<UserPhoto
							setVerifyStep={setVerifyStep}
							isUserPhoto={isUserPhoto}
						/>
					)}
				</div>
			</div>
		</main>
	);
};

export default VerifyPage;
