import { Assets } from "./pages/Assets/index.jsx"
import { useAlert } from "./context/AlertContext.jsx";
import { Alert } from "./components/alert/Alert.jsx";

function App() {
  const { close } = useAlert()
  
  return (
    <>
      {close && <Alert />}
      <Assets />
    </>
  )
}

export default App
