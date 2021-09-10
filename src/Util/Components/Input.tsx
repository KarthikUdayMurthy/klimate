import * as React from 'react';

interface InputProps {
  label: string;
  required: boolean;
  type: string;
  value: any;
  onChangeHandler: (e) => void;
}

const Input: React.FC<InputProps> = ({
  label,
  required,
  type,
  value,
  onChangeHandler
}) => {
  return (
    <div className="inputWrap">
      <label>
        {type.toLowerCase() === 'checkbox' ? '' : label + ':'}
        {type.toLowerCase() === 'checkbox' ? (
          <React.Fragment>
            <input type={type} checked={value} onChange={onChangeHandler} />
            {value && (
              <span className="checkIconWrap">
                <i className={'fas fa-check-square'} />
              </span>
            )}
            {!value && (
              <span className="checkIconWrap">
                <i className={'fas fa-square'} />
              </span>
            )}
          </React.Fragment>
        ) : (
          <input type={type} value={value} onChange={onChangeHandler} />
        )}
        {type.toLowerCase() === 'checkbox' ? ' ' + label : ''}
      </label>
    </div>
  );
};

export { Input };
