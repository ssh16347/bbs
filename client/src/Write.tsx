import Axios from "axios";
import { Component } from "react";
import { Container,Row,Col,Form,Button,ButtonGroup } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";

interface IProps{//취소버튼 클릭시 handleCancel메서드를 호출해 상태값을 초기화
    isModifyMode : boolean;
    boardId : number;
    handleCancel : any;
}

class Write extends Component<IProps>{//생성자 함수
    constructor(props:any){
        super(props);
        this.state = {
            title : "",
            content : "",
            isRendered : false,
        };
    }
    state = {//초기 상태값 설정
        title : "",
        content : "",
        isRendered : false,
    }
    write = () => {
        Axios.post("http://localhost:8000/insult", {
            title : this.state.title,
            content : this.state.content,
        })
        .then((res) => {
            this.setState({
                title : "",
                content : "",
            });
            this.props.handleCancel();
        })
        .catch((e) => {
            console.error(e);
        });
    };

    update = () => {
        Axios.post("http://localhost:8000/update", {
            title : this.state.title,
            content : this.state.content,
            id : this.props.boardId,
        })
        .then((res) => {
            this.setState({
                title : "",
                content : "",
            });
            this.props.handleCancel();
        })
        .catch((e) => {
            console.error(e);
        });
    }
    detail = () => {
        Axios.post("http://localhost:8000/detail",{id:this.props.boardId})
        .then((res) => {
            if(res.data.length > 0){
                this.setState({
                    title : res.data[0].BOARD_TITLE,
                    content : res.data[0].BOARD_CONTENT,
                });
            }
        })
        .catch((e) => {
            console.error(e);
        });
    }
    //eslint-disable-next-line
    handleChange = (e : any) => {
        this.setState({
            [e.target.name] : e.target.value,
        });
    };
    componentDidUpadte = (prevProps:any) => {
        if(this.props.isModifyMode && this.props.boardId != prevProps.boardId){
            this.detail();
        }
    };
    render(){
        return(
            <Container>
                <Row>
                    <Col lg="12" md="12" sm="12">
                        <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>제목</Form.Label>
                            <Form.Control type="text" name="title" value={this.state.title} 
                            placeholder="제목을 입력하세요" onChange={this.handleChange}/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>내용</Form.Label>
                            <Form.Control as="textarea" name="content" value={this.state.content} 
                            placeholder="네용을 입력하세요" onChange={this.handleChange}/>
                        </Form.Group>
                        </Form>
                        <div className="d-flex justify-content-end mt-3 mb-3">
                            <ButtonGroup aria-label="Basic example">
                                <Button variant = "info" onClick={this.props.isModifyMode?this.update:this.write}>작성완료</Button>
                                <Button variant = "secondary" onClick={this.props.handleCancel}>취소</Button>
                            </ButtonGroup>
                        </div>
                    </Col>
                </Row>
            </Container>
        )
    }
}
export default Write;