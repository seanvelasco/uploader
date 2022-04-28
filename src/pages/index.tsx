import type { NextPage } from 'next'
import Head from 'next/head'
import styled from '@emotion/styled'
import Button from './components/Button';
import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode'

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	min-height: 100vh;
	justify-content: center;
	align-items: center;
	margin: 0 auto;
	.area {
		width: 100%;
		display: flex;
		flex-direction: row;
		max-width: 350px;

		align-items: center;
		gap: 2em;
		.input {
			display: none;
		}
		// make second child flex-grow in React
		& > *:nth-child(3) {
			flex-grow: 1;
		}
		#file {
			display: none;
		}
	}
`;

const UploadButton = styled.label`
	display: flex;
	align-items: center;
	justify-content: center;
	background: #328dd2;
	border: 3px solid #328dd2;
	border-radius: 50%;
	width: 80px;
	height: 80px;
	padding: 0;
	margin: 0;	
	transition: 200ms;
	cursor: pointer;
	:hover {
		background: #2672ab;
		border: 3px solid #2672ab;
	}
	svg {
		width: 50px;
		height: 50px;
		fill: #fff;
	}
`;

const Area = styled.div`
	min-width: 300px;
	display: flex;
	flex-direction: row;
	gap: 1em;
	margin-top: 1em;
	button {
		flex-basis: 100%;
	}
`


interface Manifest {
	success: boolean
	message: string
	href: string
	qr: any | null | undefined
}


const createQR = async (url: string): Promise<string> => {

	// Use black background
	const options = {
		errorCorrectionLevel: 'H',
		type: 'image/png',
		margin: 1,
		color: {
			dark: "#2c2c2c",
			light: "#fff"
		},

	}

	const qr = await QRCode.toDataURL(url, options)
	return qr
	
}

const Home: NextPage = () => {


	// multi-form upload
	const [files, setFiles] = useState<File[]>([]);
	const [uploading, setUploading] = useState<boolean>(false);
	const [uploaded, setUploaded] = useState<boolean>(false);
	const [uploadError, setUploadError] = useState<boolean>(false);
	const [manifest, setManifest] = useState<Manifest>(null);

	const handleUpload = async (e: any) => {
		e.preventDefault();
		setUploading(true);
		const formData = new FormData();
		files.forEach((file, i) => {
			formData.append(`files`, file);
		});
		try {
			const res = await fetch('https://r2.sean.ph', {
				method: 'POST',
				body: formData
			});
			const json = await res.json();

			createQR(json.href).then(img => {
				setManifest({
					success: true,
					message: json.message,
					href: json.href,
					qr: img
				})})


			setUploaded(true);
		} catch (err) {
			setUploadError(true);
		}
		setUploading(false);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { files } = e.target;
		if (files) {
			setFiles(Array.from(files));
		}
	};
	
	const changeHandler = event => {
		setFiles(event.target.files);

	}

	const handleSubmission = (e: React.FormEvent<HTMLFormElement> | any) => {
		e.preventDefault();
		// handleUpload(e);
	};


	const LinkArea = styled.div`
		padding: 1em;
		background-color: #2c2c2c;
		border-radius: 0.75em;
		cursor: pointer;
		margin: 1em 0;




		// Change font family that resembles text from 80s computers
		font-family: 'Courier New', Courier, monospace;
	
		
	`;


	const tmp = useRef<HTMLInputElement>(null)

	console.log(files)

	
	// getElementById of input element with id 'file' in React
	// const fileInput = useRef<HTMLInputElement>(null);
	


	return (
		<>
		
		<Wrapper>
		{
			manifest &&
			<img src={manifest.qr} alt='QR code' />
		}
		{
			manifest &&
			<LinkArea title='Click to copy' onClick={() => {navigator.clipboard.writeText(manifest.href)}}>{manifest.href}</LinkArea>
		}
		
			<form className='area' encType="multipart/form-data">
				<UploadButton htmlFor="file" >
					<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
						<path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/>
					</svg>
				</UploadButton>
				<input id="file" name="files" type="file" multiple onChange={handleChange}/>
				<Button transparent onClick={handleUpload}>Upload</Button>
			</form>

		</Wrapper>
		</>
	)
}

export default Home
