import React, { createContext, useReducer, useContext } from 'react';
// import { toast } from 'react-toastify';

// Initial state for the form context
const initialState = {
  forms: {}, // The forms will be dynamically added here
  submitting: false,
  success: false,
  error: null,
};

// Action types
const ACTIONS = {
  SET_FIELD: 'SET_FIELD',
  SET_ERROR: 'SET_ERROR',
  SUBMIT_FORM_REQUEST: 'SUBMIT_FORM_REQUEST',
  SUBMIT_FORM_SUCCESS: 'SUBMIT_FORM_SUCCESS',
  SUBMIT_FORM_FAILURE: 'SUBMIT_FORM_FAILURE',
  RESET_FORM: 'RESET_FORM',
  INITIALIZE_FORM: 'INITIALIZE_FORM',
};

// Reducer to manage the form state
const formReducer = (state, action) => {
  const { formId } = action.payload || {};

  switch (action.type) {
    case ACTIONS.INITIALIZE_FORM:
      return {
        ...state,
        forms: {
          ...state.forms,
          [formId]: {
            fields: action.payload.fields.reduce((acc, field) => {
              acc[field.name] = '';
              return acc;
            }, {}),
            errors: {},
          },
        },
      };
    case ACTIONS.SET_FIELD:
      return {
        ...state,
        forms: {
          ...state.forms,
          [formId]: {
            ...state.forms[formId],
            fields: {
              ...state.forms[formId]?.fields,
              [action.payload.field]: action.payload.value,
            },
            errors: {
              ...state.forms[formId]?.errors,
              [action.payload.field]: action.payload.error || null,
            },
          },
        },
      };
    case ACTIONS.SET_ERROR:
      return {
        ...state,
        forms: {
          ...state.forms,
          [formId]: {
            ...state.forms[formId],
            errors: action.payload.errors,
          },
        },
      };
    case ACTIONS.SUBMIT_FORM_REQUEST:
      return {
        ...state,
        submitting: true,
        success: false,
        error: null,
      };
    case ACTIONS.SUBMIT_FORM_SUCCESS:
      return {
        ...state,
        submitting: false,
        success: true,
      };
    case ACTIONS.SUBMIT_FORM_FAILURE:
      return {
        ...state,
        submitting: false,
        error: action.payload.error,
      };
    case ACTIONS.RESET_FORM:
      return {
        ...state,
        forms: {
          ...state.forms,
          [formId]: {
            ...state.forms[formId],
            fields: {},
            errors: {},
          },
        },
      };
    default:
      return state;
  }
};

// Create the form context
const FormContext = createContext();

// Context provider component
export const FormProvider = ({ children }) => {
  const [state, dispatch] = useReducer(formReducer, initialState);

  const setField = (formId, field, value, error = null) => {
    dispatch({
      type: ACTIONS.SET_FIELD,
      payload: { formId, field, value, error },
    });
  };

  const setError = (formId, errors) => {
    dispatch({
      type: ACTIONS.SET_ERROR,
      payload: { formId, errors },
    });
  };

  const submitForm = async (formId, formData) => {
    dispatch({ type: ACTIONS.SUBMIT_FORM_REQUEST });

    // Simulate form submission
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      dispatch({ type: ACTIONS.SUBMIT_FORM_SUCCESS });
    } catch (error) {
      dispatch({ type: ACTIONS.SUBMIT_FORM_FAILURE, payload: { error: error.message } });
    }
  };

  const resetForm = (formId) => {
    dispatch({ type: ACTIONS.RESET_FORM, payload: { formId } });
  };

  const initializeForm = (formId, fields) => {
    dispatch({
      type: ACTIONS.INITIALIZE_FORM,
      payload: { formId, fields },
    });
  };

  return (
    <FormContext.Provider value={{ state, setField, setError, submitForm, resetForm, initializeForm }}>
      {children}
    </FormContext.Provider>
  );
};

// Custom hook to use the form context
export const useFormContext = () => useContext(FormContext);