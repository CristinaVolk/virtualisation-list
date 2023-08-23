import {useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState} from "react";

type Item = {
	id: string,
	text: string
}
const items: Item[] = Array.from({ length: 10_000 }, (_, index) => ({
	id: Math.random().toString(36).slice(2),
	text: String(index),
}));

const itemHeight = 40;
const containerHeight = 600;
const overscan = 3;
const scrollingDelay = 100;

export function useVirtualScroll({itemsCount, itemHeight, containerHeight, getScrollElement}) {
	const [scrollTop, setScrollTop] = useState(0);
	const [isScrolling, setIsScrolling] = useState(false);

	useLayoutEffect(() => {
		const scrollElement = getScrollElement();

		if (!scrollElement) {
			return;
		}

		const handleScroll = () => {
			const scrollTop = scrollElement.scrollTop;

			setScrollTop(scrollTop);
		}

		handleScroll();

		scrollElement.addEventListener('scroll', handleScroll);

		return () => scrollElement.removeEventListener('scroll', handleScroll);
	}, []);

	useEffect(() => {
		const scrollElement = getScrollElement();

		if (!scrollElement) {
			return;
		}

		let timeout: number|null = null;
		const handleScroll = () => {
			setIsScrolling(true);
			if (typeof timeout === 'number') {
				clearTimeout(timeout);
			}

			timeout = setTimeout(() => {
				setIsScrolling(false);
			}, scrollingDelay);
		}

		handleScroll();

		scrollElement.addEventListener('scroll', handleScroll);

		return () => {
			if (typeof timeout === 'number') {
				clearTimeout(timeout);
			}
			scrollElement.removeEventListener('scroll', handleScroll);
		}
	}, []);

	const virtualItems = useMemo(() => {
		const startRange = scrollTop;
		const endRange = scrollTop + containerHeight;

		let startIndex= Math.ceil(startRange / itemHeight);
		let endIndex= Math.floor(endRange / itemHeight);

		startIndex = Math.max(0, startIndex - overscan);
		endIndex = Math.min(endIndex + overscan, itemsCount - 1);

		const virtualItems = [];

		for (let i = startIndex; i <= endIndex; i++) {
			virtualItems.push({
				index: i,
				offsetTop: i * itemHeight
			})
		}
		return virtualItems;
	}, [scrollTop, itemsCount]);

	return {
		isScrolling,
		virtualItems,
	}
}


export function Simple() {
	const [listItems, setListItems] = useState<Item[]>(items);
	const scrollElementRef = useRef<HTMLDivElement | null>(null);
	const totalHeightOfList = itemHeight * listItems.length;

	const {virtualItems, isScrolling} = useVirtualScroll({
		itemsCount: listItems.length,
		itemHeight,
		containerHeight,
		getScrollElement: useCallback(() => scrollElementRef.current, []),
	});

	return (
		<div style={{ padding: "0 12px" }}>
			<h1>List</h1>
			<div style={{ marginBottom: 12 }}>
				<button
					onClick={() => setListItems(items => items.slice().reverse())}
				>
					reverse
				</button>
			</div>

			<div
				ref={scrollElementRef}
				style={{
					height: containerHeight,
					overflow: "auto",
					border: "1px solid lightgrey",
					position: 'relative',
				}}
			>
				<div style={{height: totalHeightOfList}}>
					{virtualItems.map((virtualItem) => {
						const item = listItems[virtualItem.index]!;

						return (
							<div
								key={item.id}
								style={{
									position: 'absolute',
									top: 0,
									transform: `translateY(${virtualItem.offsetTop}px)`,
									height: itemHeight,
									padding: "6px 12px",
								}}>
								{isScrolling ? 'Scrolling' : item.text}
							</div>
						)
					})}
				</div>
			</div>
		</div>
	)
}
