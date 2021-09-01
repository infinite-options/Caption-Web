import React, { Component } from "react";
import "../Styles/Form.css";

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = { field: this.props.field };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    event.preventDefault();
    this.props.onHandleChange(event.target.value);
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.onHandleSubmit(event.target.value);
  }

  render() {
    const info = this.props.variable;
    return (
      <form
        onSubmit = {(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          let val = '';
          for (const pair of formData.entries()) {
            val = pair[1];
          }
          this.props.onHandleSubmit(val);
        }}
      >
        <div aria-label={"Enter your " + this.props.field + "here"}>
          {/*<textarea*/}
          <input
            className={this.props.className}
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
