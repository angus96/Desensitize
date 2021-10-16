import React, { useState, ChangeEvent } from 'react';
import Field from '../Field';
import './index.less'
import {State} from '../../types';
import { writeOnce } from '../../utils';

interface HomeProps {
  setState: (s: State) => void
}
const Home = (props: HomeProps) => {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');

  const onNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    if (!target) {
      return;
    }
    const value = target.value;

    setName(value);
  };

  const onDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    if (!target) {
      return;
    }
    const value = target.value;

    setDate(value);
  };

  const onClick = () => {
    if (!name || !date) {
      return;
    }
    writeOnce('name', name);
    writeOnce('date', date);

    props.setState(State.VIEW)
  }

  return (
    <div className="home">
      <h1 className="home__title">脱敏助手</h1>
      <Field label="我该怎么称呼你？">
        <input value={name} onChange={onNameChange} />
      </Field>

      <Field label="你从什么时候开始脱敏？">
        <input type="date" value={date} onChange={onDateChange} />
      </Field>
      <Field>
        <button className="home__button" onClick={onClick}>开始吧</button>
      </Field>
    </div>
  );
};

export default Home;