import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'antd';
import styles from './index.less';
import Logo from '@/assets/webpack.svg';

interface SearchProps {
	color: string;
}

class Search extends React.Component<SearchProps> {
	constructor (props: SearchProps){
		super(props);
	}

	handleClick = async (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
		const res = await import('./dynamic');
		console.log(res.default);
	} 

	render (){
		const { color } = this.props;
		return <div>
			<img width="100" src={Logo}/>
			<Button onClick={this.handleClick} style={{ color }} className={styles.color}>hellow-world</Button>
		</div>;
	}
}


ReactDOM.render(<Search color="red"/>, document.getElementById('root'));