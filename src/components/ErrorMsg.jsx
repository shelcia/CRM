import React from 'react';
import '../styles/error.css';

const ErrorMsg = (props) => {
	return (
		<div>
			<span className='error-msg-txt'>{ props.show ? props.msg : '' }</span>
		</div>
	)
};

export default ErrorMsg;