import React from "react";
import { Form, Input, Button, Row, Col } from "reactstrap";

const handleSubmit = (e: React.MouseEvent) => {
	e.preventDefault()
	debugger
};

export const ImageUpload = () => {
	return (
		<Form
			className="container d-flex align-items-center"
			action="/upload"
			method="post"
			encType="multipart/form-data"
		>
			<Row>
				<Col sm={7}>
					<Input type="file" name="filedata" />
				</Col>
				<Col>
					<Button onClick={handleSubmit}>Загрузить изображение</Button>
				</Col>
			</Row>
		</Form>
	);
};
