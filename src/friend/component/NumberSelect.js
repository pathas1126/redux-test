import React, { Component } from "react";

class NumberSelect extends Component {
  onChange = (e) => {
    const value = Number(e.currentTarget.value);

    // 사용자가 옵션을 선택하면 이를 부모 컴포넌트에 알림
    this.props.onChange(value);
  };
  render() {
    const { value, options, postfix } = this.props;
    return (
      <div>
        <select onChange={this.onChange} value={value}>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {postfix}
      </div>
    );
  }
}

export default NumberSelect;
