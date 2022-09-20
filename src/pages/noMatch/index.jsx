import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Result } from 'antd';

export default function NoMatch() {
	const location = useLocation();
	const navigate = useNavigate();

	return (
		<div style={{ margin: 30, textAlign: 'center' }}>
			<Result
				status="404"
				title="404"
				subTitle="Sorry, the page you visited does not exist."
				extra={
					<Button type="primary" onClick={() => navigate(-1)}>
						Back
					</Button>
				}
			/>

			{/* <Button size="small" type="primary" ghost onClick={() => navigate(-1)}>
        返回
      </Button> */}
		</div>
	);
}
