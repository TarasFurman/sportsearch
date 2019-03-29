import React from 'react';
import PropTypes from 'prop-types';

const DateTime = ({ id, label, onChange }) => {
  const date = '2019-03-04T00:00';
  return (
    <div className="form-row my-2">
      <span className="col-3 col-form-label">{label}</span>
      <div className="col-9">
        <input onChange={onChange} id={id} type="datetime-local" className="form-control" min={date} />
      </div>
    </div>
  );
};

DateTime.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default DateTime;
