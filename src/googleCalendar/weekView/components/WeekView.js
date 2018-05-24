import React, {Component} from 'react';
import {Row, Col} from 'antd';
import moment from 'moment';
import AddEventModal from './AddEventModal';
import WeekToolbar from './WeekToolbar';
import WeekHeader from './WeekHeader';
import TimeSlotGroup from './TimeSlotGroup';
import EventHighlighter from './EventHighlighter';

// TODO: Fix this!
const times = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '21',
  '22',
  '23',
  '24',
].map (time => Number (time));

const style = {
  col: {
    border: '#e0e0e0 1px solid',
  },
  weekDays: {
    height: 100,
  },
  weekDayName: {
    fontSize: 12,
    lineHeight: '32px',
    textTransform: 'capitalize',
    color: '#757575',
    marginLeft: 10,
  },
  slot: {
    height: 40,
    cursor: 'pointer',
  },
  time: {
    fontSize: 10,
    color: '#212121',
  },
};

function getAllDaysInTheWeek (currentDate = moment ()) {
  const weekStart = currentDate.clone ().startOf ('week');

  const days = Array.from (Array (7))
    .map ((day, index) => index)
    .map (day =>
      moment (weekStart).add (day, 'days').set ('minutes', 0).set ('seconds', 0)
    )
    .map (momentObj => ({
      date: momentObj.date (),
      dateStamp: +momentObj,
      weekDayName: momentObj.format ('ddd'),
    }));

  return days;
}

function collectEvent (eventCollector, event) {
  const hour = moment (event.start).hours ();
  event = {
    ...event,
    hour,
  };
  if (eventCollector[hour]) {
    eventCollector[hour].push (event);
  } else {
    eventCollector[hour] = [event];
  }
  return eventCollector;
}

function getEventsForWeek (events, startDate) {
  const weekNo = moment (startDate).week ();
  return events.reduce ((acc, event) => {
    if (event.week === weekNo) {
      return collectEvent (acc, event);
    }
  }, {});
}

class WeekView extends Component {
  state = {
    startDate: +moment (),
    weekDays: getAllDaysInTheWeek (),
    showAddEventModal: false,
    eventStart: null,
    eventEnd: null,
  };

  goToNextWeek = () => {
    const dateAfter7Days = moment (this.state.startDate).add (7, 'days');
    this.setState ({
      startDate: +dateAfter7Days,
      weekDays: getAllDaysInTheWeek (dateAfter7Days),
    });
  };

  goToPreviousWeek = () => {
    const dateBefore7Days = moment (this.state.startDate).subtract (7, 'days');
    this.setState ({
      startDate: +dateBefore7Days,
      weekDays: getAllDaysInTheWeek (dateBefore7Days),
    });
  };

  openAddEventModal = (dateStamp, time) => {
    const start = moment (dateStamp).set ('hour', time);
    const end = start.clone ().add (1, 'hour');

    this.setState ({
      showAddEventModal: true,
      eventStart: +start,
      eventEnd: +end,
    });
  };

  onCloseAddEventModal = () => {
    this.setState ({
      showAddEventModal: false,
    });
  };

  // TODO: revise the logic
  getCoordinatesForEventHighlighter = (eventStart, eventEnd) => {
    const duration = moment
      .duration (moment (eventEnd).diff (moment (eventStart)))
      .as ('hours');

    const startMinutes = moment (eventStart).minutes ();
    return {
      height: duration * 100 + '%',
      top: startMinutes === 30 ? '50%' : '0',
      width: '100%',
    };
  };

  onOkAddEventModal = title => {
    this.props.onNewEvent ({
      title,
      start: this.state.eventStart,
      end: this.state.eventEnd,
      week: moment (this.state.eventStart).week (),
    });
    this.setState ({
      showAddEventModal: false,
    });
  };

  onCurrentEventTimeChange = dates => {
    this.setState ({
      eventStart: +dates[0],
      eventEnd: +dates[1],
    });
  };

  getEventsForThisTime = (dateStamp, time, allEvents) => {
    console.log (allEvents, new Date (dateStamp));
    const startTimeStamp = moment (dateStamp)
      .set ('hour', time)
      .set ('minutes', 0)
      .set ('seconds', 0);
    const startTimeStampPlus30 = startTimeStamp.clone ().add (30, 'minutes');
    console.log (new Date (+startTimeStamp), +startTimeStamp);
    console.log (
      (allEvents[+startTimeStamp.toString ()] || [])
        .concat (allEvents[+startTimeStampPlus30.toString ()] || [])
    );

    return allEvents[+startTimeStamp] || [];
  };

  render () {
    const {
      weekDays,
      showAddEventModal,
      eventStart,
      eventEnd,
      startDate,
    } = this.state;
    const events = getEventsForWeek (this.props.events, startDate);
    console.log (events);
    return (
      <div>

        <AddEventModal
          visible={showAddEventModal}
          onCancel={this.onCloseAddEventModal}
          onOk={this.onOkAddEventModal}
          eventStart={eventStart}
          eventEnd={eventEnd}
          onTimeChange={this.onCurrentEventTimeChange}
        />

        <WeekToolbar
          goToPreviousWeek={this.goToPreviousWeek}
          goToNextWeek={this.goToNextWeek}
          startDate={startDate}
        />

        <WeekHeader weekDays={weekDays} />

        {times.map (time => (
          <TimeSlotGroup
            time={time}
            weekDays={weekDays}
            events={events[time]}
            openAddEventModal={this.openAddEventModal}
          />
        ))}
      </div>
    );
  }
}

export default WeekView;
