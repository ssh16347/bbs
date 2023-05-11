import "bootstrap/dist/css/bootstrap.min.css";
import { Container,Row,Col } from "react-bootstrap";

const Footer = () => {
    return(
        <>
        <Container fluid className="bg-secondary p-2">
            <Row>
                <Col>
                    <h6 className="text-white">Copyright &copy; all right reserved;</h6>
                </Col>
            </Row>
        </Container>
        </>
    )
}
export default Footer;