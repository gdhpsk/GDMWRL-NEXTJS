import React, { useEffect, useState } from 'react'
import { Row, Col, Accordion, Button, Nav, InputGroup, Form } from 'react-bootstrap'
import Swal from 'sweetalert2'
import styles from "@/styles/Leaderboard.module.css"
import withReactContent from 'sweetalert2-react-content'
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth'

const Auth: React.FC = () => {
    const mySwal = withReactContent(Swal);
    function signIn() {
        function setLogErr(logErr: Record<any, any>) {
            (document.getElementById("log_err1") as any).innerText = logErr.email;
            (document.getElementById("log_err2") as any).innerText = logErr.password
           }
        let login = {
            email: (document.getElementById("log_email") as any).value,
            password: (document.getElementById("log_pass") as any).value
        }
        let auth = getAuth()
        signInWithEmailAndPassword(auth, login.email, login.password)
        .then(async (usercred) => {
            if(!usercred.user.emailVerified) {
                return mySwal.update({
                html: `<h4>Unfortunately, your email, ${usercred.user.email}, has not been verified yet. Please check your inbox to verify.</h4>`
            })
            }
            mySwal.update({
                html: `<h4>Success! You have now logged in as ${usercred.user.displayName ?? usercred.user.email}.`
            })
        }).catch((error) => {
            let errs = {
                email: "",
                password: ""
            }
            switch(error.code) {
                case "auth/invalid-email":
                    errs.email = "Invalid Email"
                break;
                case "auth/invalid-password":
                    errs.password = "Invalid Password"
                break;
                case "auth/wrong-password":
                    errs.password = "Wrong password provided."
                break;
                case "auth/user-not-found":
                    errs.email = "This user could not be found."
                break;
                case "auth/user-disabled":
                    errs.email = "This user's account has been disabled."
                    break;
                    case "auth/too-many-requests":
                        errs.email = "This user's account has been temperarily disabled due to many failed attempts."
                break;
                
            }
            setLogErr(errs)
        })
    }

    function signUp() {
        function setLogErr(logErr: Record<any, any>) {
            (document.getElementById("sign_err1") as any).innerText = logErr.name;
            (document.getElementById("sign_err2") as any).innerText = logErr.email;
            (document.getElementById("sign_err3") as any).innerText = logErr.password;
            (document.getElementById("sign_err4") as any).innerText = logErr.password2
           }
           let errs = {
            name: "",
            password: "",
            email: "",
            password2: ""
        }
        let login = {
            name: (document.getElementById("sign_name") as any).value,
            email: (document.getElementById("sign_email") as any).value,
            password: (document.getElementById("sign_pass") as any).value,
            password2: (document.getElementById("sign_pass2") as any).value
        }
        if(login.password !== login.password2) {
            errs.password2 = "Please input the same password!"
            setLogErr(errs)
            return
        }
        let auth = getAuth()
        createUserWithEmailAndPassword(auth, login.email, login.password)
        .then(async (usercred) => {
            await updateProfile(usercred.user, {
                displayName: login.name
            })
            mySwal.update({
                html: `<h4>Success! You have now created an account as ${usercred.user.displayName ?? usercred.user.email}. A verification email has just been sent to you, please check your inbox.</h4>`
            })
        }).catch((error) => {
            console.log(error)
            switch(error.code) {
                case "auth/invalid-email":
                    errs.email = "Invalid Email"
                break;
                case "auth/weak-password":
                    errs.password = "Weak Password"
                break;
                case "auth/email-already-in-use":
                    errs.email = "Email is already in use"
                break;
                    case "auth/too-many-requests":
                        errs.email = "This user's account has been temperarily disabled due to many failed attempts."
                break;
                
            }
            setLogErr(errs)
        })
    }

    function display() { 
    mySwal.fire({
        background: "#333333",
        titleText: "Mobile World Records List Login",
        color: "white",
        confirmButtonColor: 'black',
        html: <>
            <div id="login">
                <Form>
                <h5 style={{textAlign: "center"}}>Login</h5>
                <br></br>
                <InputGroup>
                <InputGroup.Text id="lu">Email</InputGroup.Text>
                    <Form.Control required aria-describedby='lu' placeholder="Email..." id="log_email" type="email"></Form.Control>
                </InputGroup>
                <p id="log_err1"></p>
                <br></br>
                <InputGroup>
                    <InputGroup.Text id="pu">Password</InputGroup.Text>
                    <Form.Control required aria-describedby='pu' placeholder="Password..." type="password" id="log_pass"></Form.Control>
                </InputGroup>
                <p id="log_err2"></p>
                <br></br>
                <Button type="button" onClick={signIn}>Submit</Button>
                </Form>
            </div>
            <br></br>
            <hr/>
            <div id="signup">
                <h5 style={{textAlign: "center"}}>Signup</h5>
                <br></br>
                <Form>
                <InputGroup>
                <InputGroup.Text id="lu">Name</InputGroup.Text>
                    <Form.Control required aria-describedby='lu' placeholder="Name..." id="sign_name"></Form.Control>
                </InputGroup>
                <p id="sign_err1"></p>
                <br></br>
                <InputGroup>
                <InputGroup.Text id="lu">Email</InputGroup.Text>
                    <Form.Control required aria-describedby='lu' placeholder="Email..." id="sign_email" type="email"></Form.Control>
                </InputGroup>
                <p id="sign_err2"></p>
                <br></br>
                <InputGroup>
                    <InputGroup.Text id="pu">Password</InputGroup.Text>
                    <Form.Control required aria-describedby='pu' placeholder="Password..." type="password" id="sign_pass"></Form.Control>
                </InputGroup>
                <p id="sign_err3"></p>
                <br></br>
                <InputGroup>
                    <InputGroup.Text id="pu">Retype Password</InputGroup.Text>
                    <Form.Control required aria-describedby='pu' placeholder="Password..." type="password" id="sign_pass2"></Form.Control>
                </InputGroup>
                <p id="sign_err4"></p>
                <br></br>
                <Button onClick={signUp} type="button">Submit</Button>
                </Form>
            </div>
        </>
    })
}
    return <Nav.Link onClick={display} style={{color: "white"}}>Login</Nav.Link>
}

export default Auth