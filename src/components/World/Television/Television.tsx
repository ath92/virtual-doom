import React, { useState, useCallback } from 'react';
import Rotate from '../../Transform/Rotate';
import Translate from '../../Transform/Translate';
import Intersectable from '../../Intersectable/Intersectable';
import Youtube from 'react-youtube';
import styles from './Television.module.css';

const Television: React.FC = () => {
	const [player, setPlayer] = useState<{ playVideo: () => void, pauseVideo: () => void } | null>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	
	const dimensions = { 
		width: `500px`,
		height: `320px`
	};

	const onReady = useCallback(e => {
		setPlayer(e.target);
	}, [setPlayer]);

	const onIntersection = useCallback((type?: string) => {
		if (type === 'click' && player !== null) {
			if (isPlaying) {
				player.pauseVideo();
			} else {
				player.playVideo();
			}
			setIsPlaying(!isPlaying);
		}
	}, [player, setIsPlaying, isPlaying]);

	return (
        <>
            <Intersectable callback={onIntersection} id="video">
                <div style={dimensions}>
                    <Youtube
                        videoId="ICcFMBzOnYs"
                        opts={{ ...dimensions }}
                        onReady={onReady}
                    ></Youtube>
                </div>
            </Intersectable>

            <Translate z={-320}>
                <Rotate y={-90}>
                    <div className={styles.side}></div>
                </Rotate>
                <Translate x={500}>
                    <Rotate y={-90}>
                        <div className={styles.side}></div>
                    </Rotate>
                </Translate>
                <Translate y={80}>
                    <div className={styles.back}></div>
                </Translate>
            </Translate>

            <Translate y={320}>
                <div className={styles.furniture}></div>
                <Translate z={-320}>
                    <div className={styles.furniture}></div>
                </Translate>
            </Translate>
        </>
	)
}

export default Television;