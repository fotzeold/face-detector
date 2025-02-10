import { useState, useEffect } from "react";
import FaceVerification from "../FaceVerification/FaceVerification";
import "./Camera.scss";

const UserCamera = ({ proccesPhoto, setVerifyStep }) => {
	const [image, setImage] = useState(null);
	const [isCameraOpen, setIsCameraOpen] = useState(true);

	const handleRemakePhoto = () => {
		setImage(null);
		setIsCameraOpen(true);
	};

	const handleSubmitPhoto = () => {
		savePhoto();
	};

	useEffect(() => {
		if (image) {
			setIsCameraOpen(false);
		}
	}, [image]);

	async function savePhoto() {
		window.alert("Photo Saved...")
		setImage(null);
		setIsCameraOpen(true);
	}

	return (
		<div className="camera">
			<div className="camera__wrapper">
				{isCameraOpen && (
					<div className="camera__active">
						<FaceVerification
							capturedImage={image}
							setCapturedImage={setImage}
						/>
						<button className="camera-exit" onClick={() => setVerifyStep("")}>
							✖
						</button>
					</div>
				)}

				{image && (
					<div className="camera__preview">
						<img src={image} alt="camera__preview-photo" />
						<div className="camera__preview-btns">
							<button
								onClick={handleSubmitPhoto}
								className="btn btn-basic btn-purple"
							>
								Uložiť fotografiu
							</button>
							<button
								onClick={handleRemakePhoto}
								className="btn btn-basic btn-purple"
							>
								Znova odfotiť
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default UserCamera;
