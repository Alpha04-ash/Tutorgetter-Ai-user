'use client';

import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import styles from './camera.module.css';

interface CameraRecorderProps {
    onRecordingComplete?: (blob: Blob) => void;
    autoStart?: boolean;
}

export interface CameraRecorderHandle {
    startRecording: () => void;
    stopRecording: () => void;
}

const CameraRecorder = forwardRef<CameraRecorderHandle, CameraRecorderProps>(({ onRecordingComplete, autoStart = false }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const [isRecording, setIsRecording] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const onRecordingCompleteRef = useRef(onRecordingComplete);

    useEffect(() => {
        onRecordingCompleteRef.current = onRecordingComplete;
    }, [onRecordingComplete]);

    const startStream = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.style.width = '100%';
                videoRef.current.style.height = '100%';
                videoRef.current.style.objectFit = 'cover';
                videoRef.current.style.transform = 'scaleX(-1)';
            }
        } catch (err) {
            console.error("Camera access denied:", err);
            setError("Could not access camera/microphone. Please allow permissions.");
        }
    };

    const startRecording = () => {
        if (!streamRef.current) return;

        chunksRef.current = [];
        const mediaRecorder = new MediaRecorder(streamRef.current, { mimeType: 'video/webm;codecs=vp8,opus' });
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
                chunksRef.current.push(e.data);
            }
        };

        mediaRecorder.onstop = () => {
            const blob = new Blob(chunksRef.current, { type: 'video/webm' });
            if (onRecordingCompleteRef.current) {
                onRecordingCompleteRef.current(blob);
            }
        };

        mediaRecorder.start(1000); // Collect 1s chunks
        setIsRecording(true);
    };

    const stopRecording = (): Promise<Blob> => {
        return new Promise((resolve) => {
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
                mediaRecorderRef.current.onstop = () => {
                    const blob = new Blob(chunksRef.current, { type: 'video/webm' });
                    setIsRecording(false);
                    if (onRecordingComplete) {
                        onRecordingComplete(blob);
                    }
                    resolve(blob);
                };
                mediaRecorderRef.current.stop();
            } else {
                resolve(new Blob([], { type: 'video/webm' }));
            }
        });
    };

    useImperativeHandle(ref, () => ({
        startRecording,
        stopRecording
    }));

    useEffect(() => {
        startStream();
        return () => {
            streamRef.current?.getTracks().forEach(track => track.stop());
        };
    }, []);

    useEffect(() => {
        if (autoStart && streamRef.current && !isRecording) {
            startRecording();
        }
    }, [autoStart, streamRef.current]);

    return (
        <div className={styles.wrapper} style={{ width: '100%', height: '100%' }}>
            {error && <div className={styles.error}>{error}</div>}
            <div className={styles.videoContainer} style={{ width: '100%', height: '100%', borderRadius: 0 }}>
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`${styles.video} ${isRecording ? styles.recording : ''}`}
                />
                {isRecording && (
                    <div className={styles.indicatorContainer}>
                        {/* Styles for dot/text might also be missing or named differently? Let's check CSS again */}
                        <div className={styles.recordingDot}></div>
                        <span className={styles.recordingText}>REC</span>
                    </div>
                )}
            </div>
        </div>
    );
});

export default CameraRecorder;
