import { useState } from 'react'
import './App.css'
import Home from './components/Home';
import View from './components/View';
import {readOnce} from './utils'
import {State} from './types';

const useLocalState = () => {
  const name = readOnce('name');
  const date = readOnce('date');
  const [state, setState] = useState(State.FRESH)

  if (name && date && state === State.FRESH) {
    setState(State.VIEW);
  }

  return {
    state,
    setState,
    name,
    date
  }
}

function App() {
  const localState = useLocalState();

  return (
    <div className="App">
      {
        localState.state === State.VIEW
          ? <View setState={localState.setState} />
          : <Home setState={localState.setState} />
      }
    </div>
  )
}

export default App
