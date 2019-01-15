import React, { Component } from "react";
import s from "./styles.scss";
import startOfMonth from "date-fns/start_of_month";
import startOfWeek from "date-fns/start_of_week";
import endOfWeek from "date-fns/end_of_week";
import startOfDay from "date-fns/start_of_day";
import endOfMonth from "date-fns/end_of_month";
import isAfter from "date-fns/is_after";
import addDays from "date-fns/add_days";
import is_within_range from "date-fns/is_within_range";
import format from "date-fns/format";
import { isBefore, isWithinRange, addWeeks } from "date-fns";

const TODAY = new Date();
const day = dt => startOfDay(dt).toLocaleDateString();
const dateId = date => format(date, "YYYY-MM-DD")

const LEFT = 'ArrowLeft';
const UP = 'ArrowUp';
const RIGHT = 'ArrowRight';
const DOWN = 'ArrowDown';

export default class extends Component {
  state = {
    focus: null,
    current: day(TODAY)
  };

  ref = React.createRef();

  handleFocus = (e, date) => {
    console.log(date);
  };

  handleBlur = (e, date) => {
    console.log(date);
  };

  handleKeyDown = (e, date) => {
    const options = {
      [LEFT]: date => addDays(date, -1),
      [RIGHT]: date => addDays(date, 1),
      [UP]: date => addWeeks(date, -1),
      [DOWN]: date => addWeeks(date, 1),
    };

    const { key } = e;
    const navigate = options[key];

    if(navigate) {
      this.select(navigate(date))
    }
    console.log(e.key)
  };

  getWeek(day) {
    const start = startOfWeek(day);
    const end = endOfWeek(day);
  }

  select = (date) => {
    const day = this.ref.current.querySelector(`#cal-${dateId(date)}`);

    if(day) {
      day.focus();
    }
  }

  render() {
    const { current } = this.state;
    const first = startOfMonth(current);
    const last = endOfMonth(current);
    const start = startOfWeek(first);
    const end = endOfWeek(last);

    const weeks = [];
    const days = ["M", "T", "W", "Th", "F", "S", "Su"];
    let day = start;

    while (isWithinRange(day, start, end)) {
      weeks.push(
        Array(7)
          .fill()
          .map((_, i) => addDays(day, i))
      );
      day = addDays(day, 7);
    }

    return <table ref={this.ref}>
        <thead>
          <tr>
            {days.map(d => <th key={d}>{d}</th>)}
          </tr>
        </thead>
        <tbody>
          {weeks.map(week => <tr key={week[0].getDate()}>
              {week.map(day => {
                const id = dateId(day);
                return (<td
                  tabIndex="-1"
                  data-date={id}
                  id={`cal-${id}`}
                  key={id}
                  onFocus={e => this.handleFocus(e, day)}
                  onBlur={e => this.handleBlur(e, day)}
                  onKeyDown={e => this.handleKeyDown(e, day, start, end)}
                >
                  {day.getDate()}
                </td>
              )})}
            </tr>)}
        </tbody>
      </table>;
  }
}
