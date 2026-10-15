// React에서 상태값을 사용하기 위해 useState를 가져옴
import { useState } from 'react'
// Navigate, useNavigate를 react-router-dom에서 가져옴
import { Navigate, useNavigate } from 'react-router-dom'
import './App.css' // App.jsx에서 사용할 css 파일 연결


function App() { // 관리자 화면을 담당하는 App 컴포넌트
  // useNavigate()를 사용하면 상황에서 따라 다른 페이지로 이동할 수 있음
  const navigate = useNavigate()
  // users : 사용자 목록을 저장, setUsers : users를 변경할 때 사용하는 함수
  const [users, setUsers] = useState([
    {id: 1, name: '홍길동', point: 8500},
    {id: 2, name: '김철수', point: 12000},
    {id: 3, name: '이영희', point: 5500}])
  // 2. 그래프 표시 여부 true, false :그래프를 보여줌, 보여주지 않음
  const [showGraph, setShowGraph] = useState(false)
  // 3. 포인트 관리에 필요한 상태값
  // 현재 선택한 사용자 ID, 처음에는 1번 사용자를 선택
  const [selectedId, setSelectedId] = useState('1')
  // add, subtract : 포인트 적립, 차감
  const [pointType, setPointType] = useState('add')
  // 관리자가 입력한 포인트
  const [amount, setAmount] = useState('')
  // 포인트 처리 결과 메시지
  const [message, setMessage] = useState('')
  // 포인트 변경 이력을 저장하는 상태값
  const [history, setHistory] = useState([])
  // 4. 로그인 정보 확인
  // localStorage에 저장되어 있는 로그인 여부 가져오기
  const isLogin = localStorage.getItem('isLogin')
  // localStorage에 저장되어 있는 사용자 권한 가져오기
  const role = localStorage.getItem('role')
  // 5. 관리자 접근 권한 확인
  // 로그인하지 않았거나 관리자 권한이 아니라면 로그인 화면으로 이동
  if (isLogin !== 'true' || role !== 'admin') {
    return <Navigate to="/" replace />
  }
  // 6. 가장 높은 포인트 계산
  // 포인트 숫자들만 모은 배열 만들기
  const points = users.map((user) => user.point);
  // apply로 최댓값 찾기 (비어있을 경우를 대비해 기본값 1과 비교)
  const maxPoint = Math.max(Math.max.apply(null, points), 1);
  // 7. 포인트 지급 / 차감 함수
  const handlePointUpdate = () => {
    const pointValue = Number(amount)// input으로 입력받은 값은 문자열, 숫자로 변경
    // select에서 가져온 selectedId도 문자열이므로 숫자로 변경
    const userId = Number(selectedId)
    // 포인트를 입력하지 않았거나 0 이하의 값을 입력한 경우
    if (amount === '' || pointValue <= 0) { // 오류 메시지 출력
      setMessage('1 이상의 포인트를 입력하세요.')
      return          // 함수 실행 종료
    }

    const selectedUser = users.find(// 현재 선택한 사용자 찾기
      (user) => user.id === userId
    )

    // 사용자를 찾지 못한 경우
    if (!selectedUser) {
      setMessage('사용자를 찾을 수 없습니다.')
      return
    }

    // 차감할 포인트가 현재 포인트보다 큰 경우 검사
    if (pointType === 'subtract' && pointValue > selectedUser.point) {
      setMessage('현재 보유 포인트보다 많이 차감할 수 없습니다.')
      return
    }
    const updatedUsers = users.map((user) => {
      // 선택한 사용자가 아니라면
      // 기존 사용자 정보를 그대로 반환
      if (user.id !== userId) {
        return user
      }
      // 변경될 포인트 저장 변수
      let newPoint

      if (pointType === 'add') { // 포인트 적립
        newPoint = user.point + pointValue
      } else { // 포인트 차감
        newPoint = user.point - pointValue
      }
      // 기존 사용자 정보는 유지하면서
      // point 값만 새로운 값으로 변경
      const updatedUser = Object.assign({}, user, {point: newPoint})

      return updatedUser // 변경된 사용자 반환
    })

    // 변경된 사용자 배열을 users에 저장
    setUsers(updatedUsers)

    // 포인트 변경 이력 생성
    const newHistory = {
      // 현재 시간을 고유 번호로 사용
      id: Date.now(),
      // 선택한 사용자 이름
      name: selectedUser.name,
      // add 또는 subtract
      type: pointType,
      // 변경한 포인트
      point: pointValue
    }
    // 새로운 이력을 기존 이력에 추가
    // [newHistory]
    // 기존 history 배열과 연결
    const updatedHistory = [newHistory].concat(history)
    // 변경된 이력 배열 저장
    setHistory(updatedHistory)
    // 처리 완료
    setMessage('포인트가 정상적으로 반영되었습니다.')
    // 입력창 초기화
    setAmount('')
  }
  // 8. 로그아웃 함수
  const handleLogout = () => {
    localStorage.removeItem('isLogin') // 로그인 정보 삭제
    localStorage.removeItem('role') // 사용자 권한 정보 삭제
    navigate('/')  // 로그인 화면으로 이동
  }
  // 9. 화면 출력
  return ( // 관리자 화면 전체 영역
    <main className="admin-page">
      <h1>관리자 포인트 관리</h1>
      {/* 포인트 지급 / 차감 */}
      <PointForm users={users} selectedId={selectedId}
        setSelectedId={setSelectedId} pointType={pointType}
        setPointType={setPointType} amount={amount}
        setAmount={setAmount} message={message}
        handlePointUpdate={handlePointUpdate}/>
      {/* 사용자 목록 */}
      <UserList users={users}/>
      {/* 그래프 / 로그아웃 버튼 */}
      <div className="button-area">
        {/* 그래프 보기 / 닫기 */}
        <button onClick={() => setShowGraph(!showGraph)}>
          {showGraph ? '그래프 닫기' : '그래프 보기'}
        </button>
        {/* 로그아웃 */}
        <button onClick={handleLogout}>로그아웃</button>
      </div>
      {/* 사용자 포인트 그래프 */}
      {/* showGraph가 true일 때만 그래프 표시 */}
      {showGraph && (<PointGraph users={users} maxPoint={maxPoint}/>
      )}
      {/* 포인트 변경 이력 */}
      <PointHistory history={history}/>
    </main>
  )
}

// 다른 파일에서 App 컴포넌트를 사용할 수 있도록 함
export default App