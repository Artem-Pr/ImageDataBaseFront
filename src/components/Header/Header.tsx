import React from "react";
import logo from "../../assets/images/logo.svg";
import { Col, Container, Row } from "reactstrap";

export const Header = () => {
	return (
		<header className="App-header">
			<Container className="mb-4">
				<Row>
					<Col sm={2}>
						<img src={logo} className="h-100 w-100" alt="logo" />
					</Col>
					<Col sm={9} className="mb-0 d-flex align-items-center">
						<h1 className="mb-0 mx-auto">Image Data Base</h1>
					</Col>
				</Row>
			</Container>
		</header>
	);
};
