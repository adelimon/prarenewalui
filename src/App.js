import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Form from "react-jsonschema-form";
import schema from './schemas/FormSchema';
import axios from 'axios';

const uischema = {
  "firstName": {
    "ui:autofocus": true,
    "ui:emptyValue": "",
    "ui:readonly": true,
  },
  "lastName": {
    "ui:autofocus": false,
    "ui:emptyValue": "",
    "ui:readonly": true,
  }, 
  "email": {
    "ui:autofocus": false,
    "ui:emptyValue": "",
    "ui:readonly": true,
  },
  "token": {
    "ui:widget": "hidden"
  }
};

let formData = {
}

let token = window.location.pathname.replace(/\//g, "");
const onSubmit = ({formData}) => {
  console.log("Data submitted: ",  formData);
  document.getElementById("submitBtn").disabled = true;
  document.getElementById("submitted").style.visibility= "visible" ;

  axios.post('http://localhost:8000/members/renew/', {
    token: token,
    insCopy: formData.insuranceCapture
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
}
export default class App extends React.Component {
 
  async componentWillMount() {
    let memberResponse = await axios.get('http://localhost:8000/members/'+token);
    let data = memberResponse.data;
    formData.lastName = data.last_name;
    formData.firstName = data.first_name;
    formData.email = data.email;
    formData.token = token;
    formData["agreement"] = formData.firstName + " " + formData.lastName + " ";
    //console.log(formData);  
    this.setState({formData});
  }
  render() { 
    const log = (type) => console.log.bind(console, type);

    return (
    <Form schema={schema} uiSchema={uischema} formData={formData}
        onChange={log("changed")}
        onSubmit={onSubmit}
        onError={log("errors")}>
      <div>
        <button id="submitBtn" type="submit" className="btn btn-info">Submit</button>
      </div>
      <div id="submitted">
        Thanks for submitting your renewal!  You should be all set, just send your payment per the 
        instructions in email!
      </div>
    </Form>
    );
  }
}