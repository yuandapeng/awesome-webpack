import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'antd';
import styles from './index.less';

interface SearchProps {
   color: string;
}

class Search extends React.Component<SearchProps> {
	constructor (props:SearchProps){
		super(props);
	}
	render (){
		const { color } = this.props;
		return <div className={styles.color} style={{ color: color }}> 
			<Button>search</Button>
		</div>;
	}
}

ReactDOM.render(<Search color="red"/>, document.getElementById('root'));