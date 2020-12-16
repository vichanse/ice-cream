import React, { useEffect, useState, useRef } from 'react';
import LoaderMessage from '../structure/LoaderMessage';
import { getMenuItem, putMenuItem, deleteMenuItem } from '../data/iceCreamData';
import PropTypes from 'prop-types';
import IceCreamImage from './IceCreamImage';
import useUniqueIds from '../hooks/useUniqueIds';
import Main from '../structure/Main';
import {
  validateDescription,
  validateQuantity,
  validatePrice,
} from '../utils/validators';
import useValidation from '../hooks/useValidation';
import ErrorContainer from '../ice-cream/ErrorContainer';

const EditIceCream = ({ match, history }) => {
  const isMounted = useRef(true);
  const [menuItem, setMenuItem] = useState({
    price: '0.00',
    inStock: true,
    quantity: '0',
    description: '',
    iceCream: {},
  });
  const [isLoading, setIsLoading] = useState(false);
  const [
    descriptionId,
    descriptionIdErrorId,
    stockId,
    quantityId,
    quantityErrorId,
    priceId,
    priceErrorId,
  ] = useUniqueIds(7);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const formRef = useRef(null);

  const [descriptionError, descriptionErrorProps] = useValidation(
    menuItem.description,
    descriptionIdErrorId,
    hasSubmitted,
    validateDescription,
    true
  );
  const [quantityError, quantityErrorProps] = useValidation(
    menuItem.quantity,
    quantityErrorId,
    hasSubmitted,
    validateQuantity,
    false,
    menuItem.inStock
  );
  const [priceError, priceErrorProps] = useValidation(
    menuItem.price,
    priceErrorId,
    hasSubmitted,
    validatePrice,
    true
  );

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    setIsLoading(true);
    getMenuItem(match.params.menuItemId)
      .then(({ id, price, inStock, quantity, description, iceCream }) => {
        if (isMounted.current) {
          setMenuItem({
            id,
            price: price.toFixed(2),
            inStock,
            quantity: quantity.toString(),
            description,
            iceCream,
          });
          setIsLoading(false);
        }
      })
      .catch(err => {
        if (err.response.status === 404 && isMounted.current) {
          history.replace('/', { focus: true });
        }
      });
  }, [match.params.menuItemId, history]);

  const onChangeHandler = e => {
    let newMenuItem = {
      ...menuItem,
      [e.target.name]:
        e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    };

    if (e.target.name === 'quantity') {
      newMenuItem.inStock = e.target.value !== 0;
    }

    if (e.target.name === 'inStock' && !e.target.checked) {
      newMenuItem.quantity = 0;
    }

    setMenuItem(newMenuItem);
  };

  const onSubmitHandler = e => {
    e.preventDefault();

    setHasSubmitted(true);

    if (descriptionError || quantityError || priceError) {
      setTimeout(() => {
        const errorControl = formRef.current.querySelector(
          '[aria-invalid="true"]'
        );
        errorControl.focus();
      });
    } else {
      const { id, price, inStock, quantity, description, iceCream } = menuItem;

      const submitItem = {
        id,
        price: parseFloat(price),
        inStock,
        quantity: parseFloat(quantity),
        description,
        iceCream: { id: iceCream.id },
      };

      putMenuItem(submitItem).then(() => {
        history.push('/', { focus: true });
      });
    }
  };

  const onDeleteHandler = () => {
    deleteMenuItem(match.params.menuItemId).then(() => {
      history.replace('/', { focus: true });
    });
  };

  return (
    <Main headingText="Update this beauty">
      <LoaderMessage
        loadingMessage="Loading ice cream"
        doneMessage="Ice cream loaded"
        isLoading={isLoading}
      />
      {!isLoading && (
        <div className="form-frame">
          <div className="image-container">
            <IceCreamImage iceCreamId={menuItem.iceCream.id} />
          </div>
          <div className="form-container">
            <dl>
              <dt>Name:</dt>
              <dd>{menuItem.iceCream.name}</dd>
            </dl>
            <form onSubmit={onSubmitHandler} noValidate ref={formRef}>
              <label htmlFor={descriptionId}>
                Description<span aria-hidden="true">*</span>:
              </label>
              <ErrorContainer
                errorText={descriptionError}
                hasSubmitted={hasSubmitted}
                errorId={descriptionIdErrorId}
              >
                <textarea
                  id={descriptionId}
                  name="description"
                  rows="3"
                  value={menuItem.description}
                  onChange={onChangeHandler}
                  {...descriptionErrorProps}
                />
              </ErrorContainer>
              <label htmlFor={stockId}>InStock:</label>
              <div className="checkbox-wrapper">
                <input
                  id={stockId}
                  type="checkbox"
                  name="inStock"
                  checked={menuItem.inStock}
                  onChange={onChangeHandler}
                />
                <div className="checkbox-wrapper-checked" />
              </div>
              <label htmlFor={quantityId}>Quantity:</label>
              <ErrorContainer
                errorText={quantityError}
                hasSubmitted={hasSubmitted}
                errorId={quantityErrorId}
              >
                <select
                  id={quantityId}
                  name="quantity"
                  value={menuItem.quantity}
                  onChange={onChangeHandler}
                  {...quantityErrorProps}
                >
                  <option value="0">0</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="30">30</option>
                  <option value="40">40</option>
                  <option value="50">50</option>
                </select>
              </ErrorContainer>
              <label htmlFor={priceId}>
                Price<span aria-hidden="true">*</span>:
              </label>
              <ErrorContainer
                errorText={priceError}
                hasSubmitted={hasSubmitted}
                errorId={priceErrorId}
              >
                <input
                  id={priceId}
                  type="number"
                  step="0.01"
                  name="price"
                  value={menuItem.price}
                  onChange={onChangeHandler}
                  {...priceErrorProps}
                />
              </ErrorContainer>
              <div className="button-container">
                <button className="ok" type="submit">
                  Save
                </button>
                <button
                  className="warning"
                  type="button"
                  onClick={onDeleteHandler}
                >
                  Delete
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Main>
  );
};

EditIceCream.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.object.isRequired,
  }),
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
  }),
};

export default EditIceCream;
