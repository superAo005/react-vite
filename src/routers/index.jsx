import React, { lazy, Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import LayoutPage from '@/layout';
import Loading from '@/components/Loading';

import { filterRoutes } from '@/utils';
const TableList = lazy(() => import('@/pages/table'));
// 实现懒加载的用Suspense包裹 定义函数
const lazyLoad = children => {
	return <Suspense fallback={Loading}>{children}</Suspense>;
};
const routeList = [
	{
		path: '/',
		element: <LayoutPage />,
		children: [
			{
				path: 'components',
				title: '组件',
				children: [
					{
						path: 'table',
						title: '表格',
						element: lazyLoad(<TableList />),
					},
					{
						path: 'table2',
						title: '表格',
						element: lazyLoad(<TableList />),
					},
					{
						path: 'table3',
						title: '表格',
						element: lazyLoad(<TableList />),
					},
				],
			},
			// {
			//   path: '*',
			//   name: 'No Match',
			//   key: '*',
			//   element: lazyLoad(<NoMatch />),
			// },
		],
	},
	// {
	//   path: 'login',
	//   element: lazyLoad(<Login />),
	// },
];

const RenderRouter = props => {
	let { roles = [] } = props;
	const userInfo = JSON.parse(localStorage.getItem('userInfo'));
	roles = userInfo?.roles || [];
	let filetRouteList = filterRoutes(roles, routeList);
	return useRoutes(filetRouteList);
};
export { routeList };
export default RenderRouter;
