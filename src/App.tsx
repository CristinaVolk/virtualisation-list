import { useState } from "react";
import { Simple } from "./examples/Simple";
import { Advanced } from "./examples/Adnanced";
import { DynamicHeight } from "./examples/DynaminHeight";

const examplesMap = {
	simple: Simple,
	advanced: Advanced,
	dynamicHeight: DynamicHeight,
};

type Example = keyof typeof examplesMap;

export const App = () => {
	const [example, setExample] = useState<Example>("dynamicHeight");
	const Component = examplesMap[example];
	return (
		<div>
			<div>
				{Object.keys(examplesMap).map((exampleKey) => (
					<button
						key={exampleKey}
						onClick={() => setExample(exampleKey as Example)}
					>
						{exampleKey}
					</button>
				))}
			</div>
			{<Component />}
		</div>
	);
};
