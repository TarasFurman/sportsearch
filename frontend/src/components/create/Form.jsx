import React from 'react';
import PropTypes from 'prop-types';

import DateTime from './Datetime';
import LoadImage from './LoadImage';
import Input from './Input';
import Checkbox from './Checkbox';
import Members from './Members';
import Button from './Button';
import Textarea from './Textarea';
import Select from './Select';

const Form = (props) => {
  const {
    sportTypes,
    newEvent,
    fields: { isAgeDisable, isPriceDisable },
    handleInputChange,
    handleSelectChange,
    handleAnyAgeChange,
    handleFreeChange,
    handleSubmit,
    handleCancel,
  } = props;

  return (
    <form className="p-2 shadow">
      <h3>Create new event!</h3>
      <hr />
      <LoadImage />
      <Input
        id="name"
        onChange={handleInputChange}
        value={newEvent.name}
        placeholder="event name"
      />
      <Select id="sport_id" handleChange={handleSelectChange} sportTypes={sportTypes} />
      <DateTime id="start_time" onChange={handleInputChange} label="Start time:" />
      <DateTime id="end_time" onChange={handleInputChange} label="End time:" />
      {/* age */}
      <div className="form-row my-2">
        <span className="col-3 col-form-label">Age:</span>
        <div className="col-3">
          <Input
            id="age_from"
            type="number"
            value={newEvent.age_from}
            onChange={handleInputChange}
            placeholder="from"
            disabled={isAgeDisable}
          />
        </div>
        <div className="col-3">
          <Input
            id="age_to"
            type="number"
            value={newEvent.age_to}
            onChange={handleInputChange}
            placeholder="to"
            disabled={isAgeDisable}
          />
        </div>
        <Checkbox onChange={handleAnyAgeChange} id="any_age" name="any" />
      </div>
      {/* price */}
      <div className="form-row my-2">
        <span className="col-3 col-form-label">Price:</span>
        <div className="col">
          <Input
            id="price"
            type="number"
            value={newEvent.price}
            onChange={handleInputChange}
            placeholder="event price"
            disabled={isPriceDisable}
          />
        </div>
        <Checkbox onChange={handleFreeChange} id="free" name="free" />
      </div>
      {/* start time */}
      <Textarea id="description" value={newEvent.description} onChange={handleInputChange} />
      <Members id="members_total" onChange={handleInputChange} label="Total numbers of members:" />
      <Members id="members_needed" onChange={handleInputChange} label="You need members:" />
      <hr />
      <div className="form-row my-2 text-center">
        <div className="col">
          <Button className="btn-success" text="Create event" onClick={handleSubmit}>
            Create
          </Button>
        </div>
        <div className="col">
          <Button className="btn-danger" text="Create event" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
};

Form.propTypes = {
  sportTypes: PropTypes.instanceOf(Array).isRequired,
  newEvent: PropTypes.instanceOf(Object).isRequired,
  fields: PropTypes.instanceOf(Object).isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleSelectChange: PropTypes.func.isRequired,
  handleAnyAgeChange: PropTypes.func.isRequired,
  handleFreeChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
};

export default Form;
