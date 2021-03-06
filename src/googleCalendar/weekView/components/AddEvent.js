import React from 'react';
import {Input, DatePicker} from 'antd';
import moment from 'moment';
import {inputStyles} from '../styles';

const {RangePicker} = DatePicker;

function AddEvent (props) {
  return (
    <React.Fragment>
      <Input
        type="text"
        placeholder="First Name"
        // value={props.title}
        style={inputStyles}
        size="large"
        autoFocus={true}
        onKeyDown={props.onTitleChange}
        onChange={props.onTitleChange}
      />
      <Input
        type="text"
        placeholder="Last Name"
        // value={props.title}
        style={inputStyles}
        size="large"
        autoFocus={true}
        onChange={props.onTitleChange}
      />
      <Input
        type="number"
        placeholder="Phone"
        // value={props.title}
        style={inputStyles}
        size="large"
        autoFocus={true}
        onChange={props.onTitleChange}
      />
      {/* <RangePicker
        style={{width: '100%'}}
        value={[moment (props.start), moment (props.end)]}
        onChange={props.onTimeChange}
        showTime={{
          format: 'HH:mm',
          hourStep: 1,
          minuteStep: 30,
          defaultValue: [moment (props.start), moment (props.end)],
        }}
        format="MMM Do, YYYY hh:mm a"
      /> */}
    </React.Fragment>
  );
}

export default AddEvent;
