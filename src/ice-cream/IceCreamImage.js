import React from 'react';
import PropTypes from 'prop-types';

const IceCreamImage = ({ iceCreameId }) =>
  iceCreameId != null && (
    <img
      src={`${
        process.env.PUBLIC_URL
      }/ice-cream-images/ice-cream-${iceCreameId.toString()}.svg`}
      alt=""
    />
  );

IceCreamImage.propTypes = {
  iceCreameId: PropTypes.number.isRequired,
};
export default IceCreamImage;
