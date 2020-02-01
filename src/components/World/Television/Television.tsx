import React, { useState, useCallback } from 'react';
import Intersectable from '../../Intersectable/Intersectable';
import Youtube from 'react-youtube';

const Television: React.FC = () => {
	const [player, setPlayer] = useState<{ playVideo: () => void, pauseVideo: () => void } | null>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	
	const styles = { 
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
		<Intersectable callback={onIntersection} id="video">
			<div style={styles}>
				<Youtube
					videoId="Lom9NVzOnKI"
					opts={{ ...styles }}
					onReady={onReady}
				></Youtube>
			</div>
		</Intersectable>
	)
}

export default Television;