import { HashRouter, Routes, Route } from 'react-router-dom'
import DashBoard from './component/DashBoard'
import NotFound from './component/NotFound'

//라우팅을 담당하는 App 함수 입니다.
function App(props) {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<DashBoard {...props} />} ></Route>
        <Route path="*" element={<NotFound {...props} />} ></Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
