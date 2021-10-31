import React from "react";
import { Route, Redirect } from "react-router-dom";



const AppRoute = ({
	component: Component,
	layout: Layout,
	isAuthProtected,
	...rest
}) => (
		<Route
			{...rest}
			render={props => {

				if (localStorage.getItem("userId") === null && isAuthProtected) {
					return (
						<Redirect to={{ pathname: "/home", state: { from: props.location } }} />
					)
				}

				return (
					<Layout>
						<Component {...props} />
					</Layout>
				);

			}}
		/>
	);

export default AppRoute;

