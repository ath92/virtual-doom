import React, { useState } from 'react';
import useTick from '../../../hooks/useTick';
import Translate from '../../Transform/Translate';
import Intersectable from '../../Intersectable/Intersectable';
import slidingDoor from './sliding-door.png';

const SlidingDoor: React.FC = () => {
	const [x, setX] = useState(0);
	const [isOpen, setIsOpen] = useState(false);

	const targetThreshold = 2; // rounding

	const toggleOpen = (intersectionType?: string) => {
		if (intersectionType === 'click') {
			setIsOpen(!isOpen);
		}
	}
	
	useTick(() => {
		const target = isOpen ? 1000 : 0;
		if (Math.abs(x - target) < targetThreshold) {
			setX(target);
			return;
		}
		setX(x + (target - x) / 5);
	});

	return (
		<Translate x={x}>
			<Intersectable callback={toggleOpen} id="door">
				<img src={slidingDoor} width="1000" height="1000" />
			</Intersectable>
		</Translate>
	)
}

export default SlidingDoor;