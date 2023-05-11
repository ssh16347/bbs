import Axios from "axios";
import { Component } from "react";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {  Pagination,Container,Row,Col,Button,Nav,Navbar,Form,Offcanvas,ListGroup,Badge,Card,Table,ButtonGroup } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import { propTypes } from "react-bootstrap/esm/Image";

const Board = ({//보드 메서드에 컴포넌트 state 값을 관리하기 위해 props를 추가하였다
  id,
  title,
  content,
  registerId,
  registerDate,
  props,
}: {
  id: number;
  title: string;
  content: string;
  registerId: string;
  registerDate: string;
  props: any;
}) => {
  return (/*
  1-1 목록의 체크박스가 선택된 상태 -> 수정하기 버튼 클릭 시 해당 글의 상세 내용이 하단에 표시되도록 설정
  1-2 목록의 체크박스가 여러개 선택된 상태 -> 수정하기 버튼 클릭 시 경고창
  1-3 체크박스가 선택되지 않은 상태 -> 수정하기 버튼 클릭 시 경고창

  부모 state 변경상태 확인을 위해 componentDidUpdate를 추가하여 글 작성/수정 완료 여부가 변경되먄 목록을 리렌더링
  수정버튼클릭시에 현재 수정모드임을 부모에게 전달하기 위해 부모에게 있는 handleModfy메서드를 호출해 
  현재 선택된 게시글을 보내준다
  */
    <tr>
      <td>
        <input
          type="checkbox"
          value={id}
          onChange={(e) => {
            props.onCheckboxChange(
              e.currentTarget.checked,
              e.currentTarget.value
            );
          }}
        ></input>
      </td>
      <td>{id}</td>
      <td>{title}</td>
      <td>{content}</td>
      <td>{registerId}</td>
      <td>{registerDate}</td>
    </tr>
  );
};
interface IProps {
  isComplete: boolean;
  handleModify: any;
  renderComplete: any;
}

class BoardList extends Component<IProps> {
  constructor(props: any) {
    super(props);
    this.state = {
      boardList: [],
      checkList: [],
    };
  }
  state = {//usestate사용하여 초기값 설정
    boardList: [],
    checkList: [],
  };

  getList = () => {
    Axios.get("http://localhost:8000/list", {})
      .then((res) => {
        const { data } = res;
        this.setState({
          boardList: data,
        });
        this.props.renderComplete();
      })
      .catch((e) => {
        console.error(e);
      });
  };
  onCheckboxChange = (checked: boolean, id: any) => {
    const list: Array<string> = this.state.checkList.filter((v) => {
      return v != id;
    });
    if (checked) {
      list.push(id);
    }
    this.setState({
      checkList: list,
    });
  };
  handleDelete = () => {
    //글삭제 메소드
    if (this.state.checkList.length == 0) {
      alert("삭제할 게시글을 선택하세요");
      return;
    }
    let boardIdList = "";
    this.state.checkList.forEach((v: any) => {
      boardIdList += `'${v}',`;
    });
    Axios.post("http://localhost:8000/delete", {
      boardIdList: boardIdList.substring(0, boardIdList.length - 1),
    })
      .then(() => {
        this.getList();
      })
      .catch((e) => {
        console.error(e);
      });
  };

  componentDidMount() {//화면 렌더링이 되기 전에 리스트 데이터가 붙음
    this.getList();
  }
  componentDidUpdate() {//갱신이 일어난 직후에 호출    최초 렌더링에서는 호출되지 않음
    if (!this.props.isComplete) {//만약 props가 iscomplate와 같지 않다면
      this.getList();//getList 실행
    }
  }

  render() {
    const { boardList }: { boardList: any } = this.state;
    return (
      <Container>
        <Row>
          <Col>
            <h1 className="mt-3 mb-3">BBS</h1>
            <Table striped>
              <thead>
                <tr>
                  <th>선택</th>
                  <th>번호</th>
                  <th>제목</th>
                  <th>내용</th>
                  <th>작성자</th>
                  <th>작성일</th>
                </tr>
              </thead>
              <tbody>
                {boardList.map((v: any) => {
                  return (
                    <Board
                      id={v.BOARD_ID}
                      title={v.BOARD_TITLE}
                      content={v.BOARD_CONTENT}
                      registerId={v.REGISTER_ID}
                      registerDate={v.REGISTER_DATE}
                      key={v.BOARD_ID}
                      props={this}//렌더링하는 부분에 아래와 같이 props를 넘긴다
                    />
                  );
                })}
              </tbody>
            </Table>
            <div className="d-flex justify-content-end mt-3 mb-3">
              <ButtonGroup aria-label="Basic example">
                <Button variant="info">글쓰기</Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    this.props.handleModify(this.state.checkList);
                  }}
                >
                  수정하기
                </Button>
                <Button variant="danger" onClick={this.handleDelete}>
                  삭제하기
                </Button>
              </ButtonGroup>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}
export default BoardList;
/*
현재 글쓰기 모드가 수정모드인지 신규작성모드인지 확인하기 위해서
ismodfymode 상태값을 관리해야 하는데 App,tsx에서 [BoardList, Write]
BoardList에서 수정버튼 클릭 -> write에서 수정,신규 모드인지 확인
BoardList에서 보낸 특정상태값을 write에서 받을 수 있어야 한다

1)BoardList App으로 수정버튼을 눌렀다는 이벤트 전달
2)app에서 수정버튼 클릭 이벤트가 들어오면 write에 수정모드로 전달
3)write에서 글작성이 완료되면 app에 완료 이벤트 전달
4)app에 글작성 완료가 오면 BoardList에서 목록 리렌더링
*/