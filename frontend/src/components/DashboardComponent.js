import React, { Component } from 'react';
import withStorage from '../services/withStorage';
import { withRouter } from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup'
import { Checkbox } from '@material-ui/core';
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import styles from '../styles/Dashboard.module.css'
import InputGroup from 'react-bootstrap/InputGroup'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'

import sort from '../icons/sort.svg'
import search from '../icons/search.svg'
import trash from '../icons/trash.svg'
import mail from '../icons/mail.svg'
import printer from '../icons/printer.svg'

class DashboardComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            activeList: Number,
            list: [],
            input: [],
            deletePopup: false,
            newListPopup: false,
        }
        
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
        fetch('http://localhost:3000/lists?username='+user.username)
            .then((res)=> res.json()
                .then((data)=> {
                    console.log(data);
                    this.setState({
                        data: data,
                    })
                }
            ))
    };  

    componentDidUpdate(){
        if(this.state.data[this.state.activeList] == undefined && this.state.data.length > 0){
            this.setState({activeList: 0})
        }else if(this.state.data[this.state.activeList] && this.state.data[this.state.activeList].list.item != this.state.list){
            this.setState({list: this.state.data[this.state.activeList].list.item})
        }
    };

    removeItem = (e) => { 
        console.log(e.target.id);
        let position = e.target.id
        let newList = this.state.list.splice(position, 1);
        let id =this.state.data[this.state.activeList]._id;
        let user= this.props.getUser();

        fetch('http://localhost:3000/lists/'+id, {
            method: 'PUT',
            headers: new Headers({
                'Content-Type': 'application/json;charset=UTF-8',
                'Access-Control-Allow-Origin': '*'
              }),
            body: JSON.stringify({
                'username' :  this.props.getUser().username,
                'list': {
                    'title': this.state.data[this.state.activeList].list.title,
                    'item': this.state.list
                }
            })
        }).then(() => {
            fetch('http://localhost:3000/lists?username='+user.username)
            .then((res)=> res.json()
                .then((data)=> {
                    console.log(data);
                    this.setState({
                        data: data,
                        input: '',
                    })
                }
            ))
         });      
    };

    addItem = (e) => {
        let newList = this.state.list.concat(this.state.input);
        let id =this.state.data[this.state.activeList]._id;
        let user= this.props.getUser();
        console.log(this.state.data[this.state.activeList].list.title);
        fetch('http://localhost:3000/lists/'+id, {
            method: 'PUT',
            headers: new Headers({
                'Content-Type': 'application/json;charset=UTF-8',
                'Access-Control-Allow-Origin': '*'
              }),
            body: JSON.stringify({
                'username' :  this.props.getUser().username,
                'list': {
                    'title': this.state.data[this.state.activeList].list.title,
                    'item': newList
                }
            })
        }).then(() => {
            fetch('http://localhost:3000/lists?username='+user.username)
            .then((res)=> res.json()
                .then((data)=> {
                    console.log(data);
                    this.setState({
                        data: data,
                        input: ''
                    })
                }
            ))
         });        
    };

    removeList = (e) => {
        let user= this.props.getUser();
        let id =this.state.data[this.state.activeList]._id;
        fetch('http://localhost:3000/lists/'+id, {
            method: 'DELETE'
        }).then(() => {
            fetch('http://localhost:3000/lists?username='+user.username)
            .then((res)=> res.json()
                .then((data)=> {
                    console.log(data);
                    this.setState({
                        data: data,
                        deletePopup: !this.state.deletePopup
                    })
                }
            ))
         })
        
    }

    handleListChoice=(e) => {
        let newActiveList = e.target.value
        console.log(newActiveList);
        this.setState({            
            activeList: newActiveList
        })
    };

    handleInput = (e) => {
        this.setState({
            input: [e.target.value]
        })
    };

    deleteWarning = (e) => {
        this.setState({
            deletePopup: !this.state.deletePopup
        })
    }

    newListDialog = (e) => {
        this.setState({
            newListPopup: !this.state.newListPopup
        })
    }

    addNewList=(e) => {      
        let user= this.props.getUser();
        fetch('http://localhost:3000/lists', {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json;charset=UTF-8',
                'Access-Control-Allow-Origin': '*'
              }),
            body: JSON.stringify({
                'username' :  this.props.getUser().username,
                'list': {
                    'title': this.textInput.value,
                    'item': []
                }
            })
        }).then(() => {
            fetch('http://localhost:3000/lists?username='+user.username)
            .then((res)=> res.json()
                .then((data)=> {
                    console.log(data);
                    this.setState({
                        data: data,
                        newListPopup: !this.state.newListPopup,
                    })
                }
            ))
         });
    }

    render() {  
        if(this.state.data[this.state.activeList] !== undefined){
            this.title = this.state.data[this.state.activeList].list.title
        }else{
            this.title = '-Please Create A List-'
        };
        console.log(this.state.deletePopup);
        
        // eslint-disable-next-line
        const title = ''
        const textInput=''
        const listItems = this.state.list.map((item, i) => 
           <ListGroup.Item key={i} style={{display:'flex', alignItems: 'center', justifyContent:'space-between'}}>
                <span 
                    style={{
                        display:'flex', 
                        alignItems: 'center'
                    }}>
                    <Checkbox  
                        style={{
                            padding:'.25rem 1rem .25rem .25rem'
                        }}/>
                    <span 
                        style={{
                            marginTop: '.25rem'
                        }}>
                        {item}
                    </span>
                </span>
                <img 
                    className={styles.imgbin} 
                    src={trash} 
                    alt='trash'
                    id={i} 
                    onClick={this.removeItem}/>
            </ListGroup.Item>
        );

        const listLists = this.state.data.map((list, i) => 
        <ListGroup.Item key={i} value={i} action onClick={this.handleListChoice} style={{display:'flex', alignItems: 'center'}}>
             <span>{list.list.title}</span>
         </ListGroup.Item>
        );
        
        return (
            <div className={styles.dashboard}>
                {this.state.deletePopup !== false &&
                    <div className={styles.popup}>
                        <Card style={{margin:'auto'}}>
                            <Card.Body>
                                <h6>Are you sure you wish to delete {this.title} ? </h6> 
                            </Card.Body>
                            <Card.Footer style={{display:'flex', flexDirection:'row', justifyContent:'space-around'}}>
                                <Button onClick={this.deleteWarning}>Cancel</Button>
                                <Button onClick={this.removeList}>Delete</Button>
                            </Card.Footer>
                        </Card>
                    </div>
                }
                {this.state.newListPopup !== false &&
                    <div className={styles.popup}>
                        <Card style={{margin:'auto'}}>
                            <Card.Body>
                                <Form>
                                    <Form.Label>What would you like your new list to be called?</Form.Label>
                                    <Form.Control
                                        ref={input => this.textInput = input}
                                        placeholder='New List Name'
                                    ></Form.Control><hr/>
                                    <span style={{display:'flex', flexDirection:'row', justifyContent:'space-around'}}>
                                        <Button onClick={this.newListDialog}>Cancel</Button>
                                        <Button onClick={this.addNewList}>Submit</Button>
                                    </span>
                                </Form>
                            </Card.Body>
                        </Card>
                    </div>
                }
                <div className={styles.sidebar}>
                    <div className={styles.menu}>
                        <h1>Menu</h1>
                        <img className={styles.img}src={search} alt='search'/>
                    </div> 
                    <ListGroup 
                        style={{
                            padding:'2%',
                        }}
                    >{listLists}</ListGroup> 
                    <div style={{padding:'2%'}}>
                        <Button
                            onClick={this.newListDialog}
                            block  
                        >+ New List</Button>
                    </div>
                </div>
                <div className={styles.list}>
                    <div className={styles.titlebar}>
                        <h1>{this.title}</h1>
                        {this.state.data.length > 0 &&
                            <div style={{display: 'flex', flexDirection:'row', justifyContent: 'space-around'}}>
                            <img className={styles.img}src={sort} alt='sort'/>
                            <img className={styles.img}src={mail} alt='mail'/>
                            <img className={styles.img}src={printer} alt='print'/>
                            <img className={styles.img}src={trash} alt='trash' onClick={this.deleteWarning}/>
                            </div>
                        }
                    </div> 
                        {this.state.data[this.state.activeList] !== undefined &&
                        <InputGroup 
                            size="lg" 
                            className="mb-3" 
                            style={{
                            padding:'1rem 1% 0 1%'
                            }}
                        >
                            <FormControl
                                aria-label="New Item..."
                                aria-describedby="basic-addon2"
                                value={this.state.input}
                                onChange={this.handleInput}
                                type='text'
                                placeholder='New Item...' 
                            />
                            <InputGroup.Append>
                                <Button 
                                    onClick={this.addItem} 
                                >+</Button>
                            </InputGroup.Append>
                        </InputGroup>
                    }
                    <ListGroup
                        style={{
                            padding:'0 1%',
                            overflowY: 'scroll', 
                            height:'72.2%'
                        }}
                    >{listItems}</ListGroup>  
                </div>
            </div>

        )
    }
}

export default withRouter(withStorage(DashboardComponent));