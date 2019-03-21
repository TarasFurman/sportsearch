import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ className = '', ...props }) => {
  const classNames = ['btn', className].join(' ');
  return <button className={classNames} type="button" {...props} />;
};

Button.defaultProps = {
  className: 'btn-secondary',
};

Button.propTypes = {
  className: PropTypes.string,
};

export default Button;
