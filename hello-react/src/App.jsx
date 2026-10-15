import { useNavigate } from 'react-router-dom'
import './App.css'
// 1. 이미지 불러오기 (파일 이름과 경로는 본인 파일에 맞게 수정)
import profileImg from './고냐니.png'
import { QRCodeSVG } from 'qrcode.react'

function App() {
  const name = '정세진'
  const studentId = '20250357' // 학번 입력
  const department = '멀티미디어학과 · 학생'
  const goal = '사용하기 편하고 보기 좋은 웹 화면 만들기'

  const qrData =
    '이름: ' + name +
    '\n학번: ' + studentId +
    '\n학과: ' + department

  const navigate = useNavigate()
  console.log(qrData)

  return (
    <main className="page">
      <section className="profile-card">
        <span className="status">● LIVE</span>
        {/* 2. 이니셜 div 대신 img 태그로 교체 */}
        <img src={profileImg} alt="프로필 사진" className="avatar-img" />

        <p className="eyebrow">HELLO REACT</p>
        <h1>{name}</h1>
        <p className="student-id">학번 : {studentId}</p>
        <p className="department">{department}</p>

        <div className="divider"></div>

        <p className="goal">목표: {goal}</p>

        <div className="tags">
          <span>HTML</span>
          <span>CSS</span>
          <span>JavaScript</span>
        </div>

        {/* 학생증 QR 코드 */}
        <div className="qr-area">
          <QRCodeSVG
            value={qrData}
            size={150}
          />
          <p>학생 QR</p>
        </div>

        <button onClick={() => navigate('/grade')}>
          성적 보기
        </button>
      </section>
    </main>
  )
}

export default App