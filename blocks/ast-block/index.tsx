import { FileBlockProps } from '@githubnext/blocks';
import { tw, setup } from 'twind';
import { Parser, Node } from 'acorn';
import { useState } from 'react';

setup({
	theme: {
		extend: {
			backgroundColor: {
				'light': '#ffffff',
				'dark': '#24292e'
			},
			colors: {
				'light': '#24292e',
				'dark': '#e1e4e8',

				'func-light': '#6f48cb',
				'func-dark': '#b392f0',

				'key-light': '#5f863a',
				'key-dark': '#85cc64',

				'bool-light': '#d73a49',
				'bool-dark': '#a5d6a7',

				'num-light': '#dd3a49',
				'num-dark': '#f97583',

				'str-light': '#032f62',
				'str-dark': '#6bbeff'
			},
		},
	},
});

function ASTItem({ label, node }: { label: string, node: Node }): JSX.Element {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div>
			<div className={ tw('cursor-pointer') } onClick={ () => setIsOpen(!isOpen) }>
				<span className={ tw('pl-2 pr-2') }>{ isOpen ? '-' : '+' }</span>
				<span className={ tw('text-func-light dark:text-func-dark') }>{ label }</span>
			</div>
			{ isOpen && (
				<div className={ tw('ml-6') }>
					{ Object.entries(node).map(([key, value]) => {
						const isEmptyArray = Array.isArray(value) && value.length === 0;
						if (typeof value === 'object' && !(isEmptyArray)) {
							return <ASTItem label={ value.type ?? key } node={ value }></ASTItem>;
						} else {
							const className = typeof value === 'boolean' ? 'bool' : typeof value === 'number' ? 'num' : 'str';

							return (
								<div>
									<span className={ tw('text-key-light dark:text-key-dark') }>{ key }</span>:&nbsp;
									<span className={ tw('text-' + className + '-light dark:text-' + className + '-dark') }>{ isEmptyArray ? '[]' : typeof value === 'string' ? '\'' + value + '\'' : value.toString() }</span>
								</div>
							);
						}
					})}
				</div>
			)}
		</div>
	);
}

{
	test: 'value'
}

export default function ASTBlock(props: FileBlockProps) {
	const parsed = Parser.parse(props.content, { ecmaVersion: 'latest' });

	return (
		<div className={ tw('bg-light dark:bg-dark text-light dark:text-dark p-6 font-mono text-sm text-key min-h-full') }>
			<ASTItem label={ parsed.type } node={ parsed }></ASTItem>
		</div>
	);
}
