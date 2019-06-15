import React, { Component } from 'react';
import withStorage from '../services/withStorage';
import { withRouter } from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup'
import { Checkbox } from '@material-ui/core';
import Button from 'react-bootstrap/Button'

class DashboardComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            input: [],
        }
        fetch('http://localhost:3000/lists/')
            .then((res)=> res.json()
                .then((data)=> {
                    data.sort((a, b) => (a.id > b.id) ? 1 : -1)
                    this.setState({list: data})                    
                }
            ))
        
    };

    componentDidMount() {

        // Title for UX/Accessability 
        document.title = `Just List It!`;

        // If a user who is not logged in tries to access the dashboard, they are redirected
        // to the login page.
        const user = this.props.getUser();
        if (user === null) {
            this.props.history.push('/');
            return;
        }
        this.setState({
            list: this.dummyList
        })
    }
    dummyList = ['item1', 'item2', 'item3', 'item4','item5']

    addItem = (e) => {
        let newList = this.state.list.concat(this.state.input);
        this.setState({
            list: newList,
            input: ''
        })
        
    };
    
    handleInput = (e) => {
        this.setState({
            input: [e.target.value]
        })
    };
    render() {
        console.log(this.state.list);
        
        const listItems = this.state.list.map((item, i) => 
           <ListGroup.Item key={i}>
                <Checkbox/>
                {item}
            </ListGroup.Item>
        );

        return (
            <div>
                <input 
                    value={this.state.input}
                    onChange={this.handleInput}
                    type='text'
                    placeholder='New Item...' 
                    style= {{borderRadius: '0.25rem', border: '1px solid rgba(0, 0, 0, 0.125)', padding: '12px', width: '100%'}}
                />
                <Button onClick={this.addItem} variant='success' style={{marginTop:'10px'}} block>Add item</Button>
                <ListGroup>{listItems}</ListGroup>  
            </div>
        )
    }
}

export default withRouter(withStorage(DashboardComponent));