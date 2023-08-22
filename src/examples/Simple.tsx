import {useLayoutEffect, useMemo, useRef, useState} from "react";

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

export function Simple() {
	const [reversed, setReversed] = useState<Item[]>(items);
	const [scrollTop, setScrollTop] = useState(0);
	const scrollElementRef = useRef<HTMLDivElement | null>(null);

	useLayoutEffect(()=>{
		const scrollElement = scrollElementRef.current;

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

	console.log(scrollTop);

	const range = useMemo(()=>{}, [scrollTop]);

	return (
		<div style={{ padding: "0 12px" }}>
			<h1>List</h1>
			<div style={{ marginBottom: 12 }}>
				<button
					onClick={() => setReversed(items => items.slice().reverse())}
				>
					reverse
				</button>
			</div>

			<div
				style={{
					height: containerHeight,
					overflow: "auto",
					border: "1px solid lightgrey",
				}}
				ref={scrollElementRef}
			>
				{reversed.map((item) => {
					return (
						<div
							key={item.id}
						style={{
							height: itemHeight,
							padding: "6px 12px",
						}}>
							{item.text}
						</div>
					)
				})}
			</div>
		</div>
	)
}
