import { useEffect } from 'react';
//redux
import { useAppSelector, useAppDispatch } from './app/hooks';
import { selectUsers, fetchUsers } from './features/counter/userSlice';
//components
import Table from './components/Table';
//css
import './App.css';

function App() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchUsers());
  }, []);
  const data = useAppSelector(selectUsers);

  return (
    <div className="Wrapper">
      <div className="App">
        {data.loading && <div>loading...</div>}
        {!data.loading && data.status === 'failed' ? (
          <div>Error: {data.status}</div>
        ) : null}
        {!data.loading ? <Table users={data.filteredItems} /> : null}
      </div>
    </div>
  );
}

export default App;
