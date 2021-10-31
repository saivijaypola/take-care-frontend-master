import React, { useState, useRef } from "react";
import Measure from "react-measure";
import { useUserMedia } from "./useUserMedia";
import { useCardRatio } from "./useCardRatio";
import { useOffsets } from "./useOffsets";

import camera from '../../../images/icon/camera-white.png'
import retake from '../../../images/icon/refresh.png'
import error from '../../../images/icon/error.png'

import {
    Video,
    Canvas,
    Wrapper,
    Container,
    Flash,
    Overlay

} from "./styles";

import { Button } from "reactstrap";

const CAPTURE_OPTIONS = {
    audio: false,
    video: { facingMode: "user" }
};

export default function Camera({ onCapture, onClear }) {
    const canvasRef = useRef();
    const videoRef = useRef();

    const [container, setContainer] = useState({ width: 0, height: 0 });
    const [isCameraAllowed, setIsCameraAllowed] = useState(true)
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [isCanvasEmpty, setIsCanvasEmpty] = useState(true);
    const [isFlashing, setIsFlashing] = useState(false);

    const mediaStream = useUserMedia(CAPTURE_OPTIONS);
    const [aspectRatio, calculateRatio] = useCardRatio(1.586);
    const offsets = useOffsets(
        videoRef.current && videoRef.current.videoWidth,
        videoRef.current && videoRef.current.videoHeight,
        container.width,
        container.height
    );

    if (mediaStream && videoRef.current && !videoRef.current.srcObject) {
        videoRef.current.srcObject = mediaStream;
    }

    function handleResize(contentRect) {
        setContainer({
            width: contentRect.bounds.width,
            height: Math.round(contentRect.bounds.width / aspectRatio)
        });
    }

    function handleCanPlay() {
        calculateRatio(videoRef.current.videoHeight, videoRef.current.videoWidth);
        setIsVideoPlaying(true);
        videoRef.current.play();
    }

    function handleCapture() {
        if(mediaStream){
            const context = canvasRef.current.getContext("2d");

            context.drawImage(
                videoRef.current,
                offsets.x,
                offsets.y,
                container.width,
                container.height,
                0,
                0,
                container.width,
                container.height
            );
    
            canvasRef.current.toBlob(blob => onCapture(blob), "image/jpeg", 1);
            setIsCanvasEmpty(false);
            setIsFlashing(true);
        }else{
            window.alert('Check your browser settings to enable camera ')
        }
       
    }

    function handleClear() {
        const context = canvasRef.current.getContext("2d");
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        setIsCanvasEmpty(true);
        onClear();
    }

    // if (!mediaStream) {

    //     return null;
    // }

    if (mediaStream) {

        return (
            <Measure bounds onResize={handleResize}>
                {({ measureRef }) => (
                    <Wrapper>

                        <Container
                            ref={measureRef}
                            maxHeight={videoRef.current && videoRef.current.videoHeight}
                            maxWidth={videoRef.current && videoRef.current.videoWidth}
                            style={{
                                height: `${container.height}px`
                            }}
                        >

                            <Video
                                ref={videoRef}
                                hidden={!isVideoPlaying}
                                onCanPlay={handleCanPlay}
                                autoPlay
                                playsInline
                                muted
                                style={{
                                    top: `-${offsets.y}px`,
                                    left: `-${offsets.x}px`
                                }}
                            />

                            <Overlay hidden={!isVideoPlaying} />

                            <Canvas
                                ref={canvasRef}
                                width={container.width}
                                height={container.height}
                            />

                            <Flash
                                flash={isFlashing}
                                onAnimationEnd={() => setIsFlashing(false)}
                            />
                        </Container>

                        {isVideoPlaying && (
                            <div onClick={isCanvasEmpty ? handleCapture : handleClear} className="submitBnt" type="submit" id="newssubscribebtn" className={isCanvasEmpty ? "pic-button take-pic" : "pic-button retake"}> {isCanvasEmpty ? <img src={camera}></img> : <img src={retake}></img>}</div>

                        )
                        }
                    </Wrapper>
                )}
            </Measure>
        );
    } else {
        return (
            <div style={{textAlign:'center',paddingTop: 30, paddingBottom: 30}}>
                <img src={error} style={{ width: 70, height: 70 }} />
                <p style={{ fontSize: 20, fontWeight: 'bold' ,marginBottom:0,marginTop:20}}>Allow access to camera</p>
                <p style={{fontSize:14}}>Check your browser settings to enable camera</p>
            </div>
        )
    }
}