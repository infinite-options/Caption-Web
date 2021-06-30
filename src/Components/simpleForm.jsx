import React, { Component } from "react";
import "../Styles/SimpleForm.css";

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = { field: this.props.field };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.props.onHandleChange(event.target.value);
  }

  render() {
    const info = this.props.variable;
    return (
      <form onSubmit={this.handleSubmit}>
        <div aria-label={"Enter your " + this.props.field + "here"}>
          <input
            className="input"
            name="variable"
            placeholder={this.props.field}
            value={info}
            onChange={this.handleChange}
          />
        </div>
      </form>
    );
  }
}

export default Form;
