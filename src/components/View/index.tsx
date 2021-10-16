import React, { useEffect } from 'react';
import { State } from '../../types';
import { readOnce, versions } from '../../utils';
import './index.less'

interface ViewProps {
  setState: (s: State) => void;
}

// TODO: 二期这里应该可以设置
const PRESET = [
  { type: 1, dose: [1, 2, 3, 4, 6, 8, 10] }, // 每周型号及用量
  { type: 2, dose: [1, 2, 3, 4, 6, 8, 10] },
  { type: 3, dose: [1, 2, 3, 4, 6, 8, 10] },
  { type: 4, dose: [3] },
  { type: 4, dose: [3] },
  { type: 5, dose: [2] },
];

const getNextDay = (date = new Date().toLocaleDateString()) => {
  const theDate = new Date(date);
  theDate.setDate(theDate.getDate() + 1);

  return theDate.toLocaleDateString();
}
const getPlan = (date: string, nextDate?: string) => {
  const now = nextDate ? +new Date(nextDate) : +new Date(new Date().toLocaleDateString());
  const then = +new Date(date.split('-').join('/'));
  if (now < then) {
    return;
  }

  const fullDays = Math.ceil((now - then) / (1000 * 60 * 60 * 24)) + 1;
  const weeks = Math.ceil(fullDays / 7);
  const days = fullDays % 7;

  const plan = weeks > PRESET.length ? PRESET.slice(-1)[0] : PRESET[weeks - 1];

  return {
    type: plan.type,
    number: plan.dose[days - 1] || plan.dose.slice(-1),
  };
};

const NextType = (props: {type: number, emphasize: boolean}) => {
  const {emphasize, type} = props;
  return emphasize
    ? <span className={`view__foot__type view__number--${type}`}>{type}</span>
    : <>{type}</>
}

const View = (props: ViewProps) => {
  const name = readOnce('name');
  const date = readOnce('date');

  useEffect(() => {
    if (!name || !date) {
      props.setState(State.FRESH);
    }
  }, []);

  if (!name || !date) {
    return <></>;
  }

  const plan = getPlan(date);
  const nextPlan = getPlan(date, getNextDay());

  const reset = () => {
    props.setState(State.RESET);
  }

  const now = new Date().toLocaleDateString().split('/').join('-');
  const iosCompatible =  versions.iPad || versions.ios || versions.iPhone;
  const shouldNotice = nextPlan && nextPlan.type !== plan?.type;

  return (
    <div className={`view ${iosCompatible ? 'ios-compatible' : ''}`}>
      <div className="view__head">
        <span className="view__head__reset" onClick={reset}>重新设定</span>
        <span className="view__head__time">开始时间：{date}</span>
      </div>

      <div className="view__content">
        <h1 className="view__content__name">你好，{name}</h1>
        {plan ? (
          <>
            <p className="view__content__current">今日计划, {now}</p>
            <p className="view__content__plan">
              畅迪
              <span className={`view__content__type view__number--${plan.type}`}>{plan.type}</span>
              号，
              <span className={`view__content__number view__number--${plan.number}`}>{plan.number}</span>
              滴
            </p>
          </>
        ) : (
          <p style={{textAlign: 'center'}}>你将在<span className="view__content__nextdate">{date}</span>开始脱敏</p>
        )}
      </div>

      <div className='view__foot'>
        {
          nextPlan
          ? <>明日计划：畅迪<NextType type={nextPlan.type} emphasize={!!shouldNotice} />号，{nextPlan.number}滴</>
          : undefined
        }
      </div>
    </div>
  );
};

export default View;
