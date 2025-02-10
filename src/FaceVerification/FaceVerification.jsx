import React, { useRef, useCallback, useState, useEffect } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import "./FaceVerification.scss";

const FaceVerification = ({ setCapturedImage }) => {
	const webcamRef = useRef(null);
	const [isModelLoaded, setIsModelLoaded] = useState(false);
	const [isInPosition, setIsInPosition] = useState(false);
	const [message, setMessage] = useState("Загрузка моделей...");
	const [step, setStep] = useState(0);

	useEffect(() => {
		let isMounted = true;

		const loadModels = async () => {
			try {
				await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
				await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
				await faceapi.nets.faceExpressionNet.loadFromUri("/models");

				if (isMounted) {
					setIsModelLoaded(true);
					setMessage("Поместите лицо в овал");
				}
			} catch (error) {
				console.error("Ошибка загрузки моделей:", error);
				if (isMounted) {
					setMessage("Ошибка загрузки моделей");
				}
			}
		};

		loadModels();

		return () => {
			isMounted = false;
		};
	}, []);

	const capture = useCallback(() => {
		if (webcamRef.current) {
			const imageSrc = webcamRef.current.getScreenshot();
			if (imageSrc) {
				setCapturedImage(imageSrc);
				setMessage("Фото сделано!");
			}
		}
	}, [setCapturedImage]);

	const checkFacePosition = useCallback((detection) => {
		if (!webcamRef.current) return false;
		const videoElement = webcamRef.current.video;
		const { videoWidth, videoHeight } = videoElement;

		// Реальні розміри відео у браузері
		const displayWidth = videoElement.clientWidth;
		const displayHeight = videoElement.clientHeight;

		const { x, y, width, height } = detection.detection.box;
		const centerX = displayWidth / 2;
		const centerY = displayHeight / 2;
		const faceCenterX = x + width / 2;
		const faceCenterY = y + height / 2;

		// Визначаємо правильну позицію
		// const isCenteredX = Math.abs(faceCenterX - centerX) < displayWidth * 0.1;
		// const isCenteredY = Math.abs(faceCenterY - centerY) < displayHeight * 0.1;


		const isCenteredX = faceCenterX * (displayWidth / videoWidth) < centerX + displayWidth / 25 && faceCenterX * (displayWidth / videoWidth) > centerX - displayWidth / 25
		const isCenteredY = faceCenterY * (displayHeight / videoHeight) < centerY + displayHeight / 20 && faceCenterY * (displayHeight / videoHeight) > centerY - displayHeight / 20


		const isProperSize = width > displayWidth * 0.45 && width < displayWidth * 0.7;

		return isCenteredX && isCenteredY && isProperSize;
	}, []);



	const checkSidePosition = useCallback(
		(detection) => {
			if (!webcamRef.current) return false;
			const videoEl = webcamRef.current.video;
			const { x, width } = detection.detection.box;
			const faceCenterX = x + width / 2;
			const { videoWidth } = videoEl;
			const centerX = videoWidth / 2;
			const tolerance = 50;

			console.log(`STEP ${step}`, `FaceCenterX: ${faceCenterX}`, `CenterX: ${centerX}`);

			if (step === 1) return faceCenterX < centerX - tolerance / 1.5; // Дозволяємо трохи раніше
			if (step === 2) return faceCenterX > centerX + tolerance / 1.5; // Дозволяємо трохи раніше

			return false;
		},
		[step]
	);


	const runDetection = useCallback(async () => {
		if (!webcamRef.current || !isModelLoaded) return;
		const video = webcamRef.current.video;

		try {
			const detection = await faceapi
				.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
				.withFaceLandmarks();

			if (detection) {
				const isCorrectPosition = checkFacePosition(detection);
				setIsInPosition(isCorrectPosition);

				if (isCorrectPosition && step === 0) {
					setMessage("Отлично! Теперь посмотрите направо");
					console.log("Лицо в центре, дальше 2 шаг, смотри направо");
					setStep(1);
				} else if (step === 1 && checkSidePosition(detection)) {
					setMessage("Теперь посмотрите налево");
					console.log("Лицо смотрит направо, дальше 3 шаг, смотри налево");
					setStep(2);
				} else if (step === 2 && checkSidePosition(detection)) {
					setMessage("Теперь посмотрите в камеру");
					console.log("Лицо смотрит налево, дальше 4 шаг, смотри в камеру");
					setStep(3);
				} else if (step === 3 && isCorrectPosition) {
					setMessage("Фото сделано!");
					setTimeout(capture, 500);
				}
			} else {
				setIsInPosition(false);
				setMessage("Лицо не обнаружено");
			}
		} catch (error) {
			console.error("Ошибка при определении лица:", error);
		}
	}, [isModelLoaded, checkFacePosition, capture, checkSidePosition, step]);

	useEffect(() => {
		if (isModelLoaded) {
			const intervalId = setInterval(runDetection, 1000);
			return () => clearInterval(intervalId);
		}
	}, [isModelLoaded, runDetection]);

	return (
		<div className="face-verification">
			<div className="face-verification__camera-container">
				<Webcam ref={webcamRef} screenshotFormat="image/jpeg" className="camera__webcam" mirrored />
				<div className={`face-verification__mask ${isInPosition ? "face-verification__mask_state_correct" : "face-verification__mask_state_incorrect"}`} />
			</div>
			<div className="face-verification__message-container">
				<p className="face-verification__message">{message}</p>
			</div>
		</div>
	);
};

export default FaceVerification;
