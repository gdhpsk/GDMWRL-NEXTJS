import React, { useEffect, useState } from 'react'
import { Row, Col, Accordion, Button, Nav, InputGroup, Form } from 'react-bootstrap'
import Swal from 'sweetalert2'
import styles from "@/styles/Leaderboard.module.css"
import withReactContent from 'sweetalert2-react-content'
import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, updateCurrentUser, updateProfile, verifyBeforeUpdateEmail } from 'firebase/auth'

const Auth: React.FC = () => {
    const mySwal = withReactContent(Swal);
    let auth = getAuth()
    let [type, setType] = useState("")
    useEffect(() => {
        (async () => {
            let go = await auth.currentUser?.getIdTokenResult(true)
            setType(go?.claims?.role ?? "user")
        })()
    }, [])
    function display() { 
    mySwal.fire({
        background: "#333333",
        titleText: `Login Settings for: ${(auth.currentUser as any).displayName}`,
        color: "white",
        confirmButtonColor: 'black',
        html: <>
        <h5 style={{textAlign: "center"}}>Email: {(auth.currentUser as any).email}</h5>
        <br></br>
        <h6 style={{textAlign: "center"}}>User Type: {type}</h6>
        <br></br>
            <div style={{display: "grid", placeItems: "center"}}>
                <Button color="red" onClick={async () => {
                   await signOut(auth)
                   mySwal.update({
                        html: `<h4>You have successfully signed out!</h4>`
                   })
                }}>Sign Out</Button>
                <br></br>
                <Button color="red" onClick={async () => {
                   await sendPasswordResetEmail(auth, (auth.currentUser as any).email)
                   mySwal.update({
                    html: `<h4>Check your inbox in your email, ${(auth.currentUser as any).email}, and you should be able to reset your password from there!</h4>`
               })
                }}>Reset Password</Button>
                <br></br>
                <Button color="red" onClick={async () => {
                   mySwal.fire({
                    background: "#333333",
                    titleText: `New Name:`,
                    color: "white",
                    confirmButtonColor: 'black',
                    html: <Form>
                        <InputGroup>
                            <InputGroup.Text id="email">Email</InputGroup.Text>
                            <Form.Control required aria-describedby='email' placeholder='Name...' id="new_name"></Form.Control>
                        </InputGroup>
                        <br></br>
                        <Button type="button" onClick={async () => {
                            let name = (document.getElementById("new_name") as any).value
                            updateProfile(auth.currentUser as any, {displayName: name})
                            mySwal.update({
                                html: `<h4>All set! Your new name is: ${name}!</h4>`
                            })
                        }}>Submit</Button>
                    </Form>
                })
                }}>Change Name</Button>
                <br></br>
                <Button color="red" onClick={async () => {
                    mySwal.fire({
                        background: "#333333",
                        titleText: `New Email:`,
                        color: "white",
                        confirmButtonColor: 'black',
                        html: <Form>
                            <InputGroup>
                                <InputGroup.Text id="email">Email</InputGroup.Text>
                                <Form.Control required aria-describedby='email' placeholder='Email...' id="new_email" type="email"></Form.Control>
                            </InputGroup>
                            <p id="new_email_err"></p>
                            <br></br>
                            <Button type="button" onClick={() => {
                                let email = (document.getElementById("new_email") as any).value
                                 verifyBeforeUpdateEmail(auth.currentUser as any, email).then(() => {
                                    mySwal.update({
                                        html: `<h4>Awesome! Now go check your inbox on your new email ${email}, and verify it to change your email!</h4>`
                                    })
                                }).catch((e) => {
                                    switch(e.code) {
                                        case "auth/invalid-email":
                                            (document.getElementById("new_email_err") as any).innerText = "Invalid Email."
                                        break;
                                        case "auth/email-already-in-use":
                                            (document.getElementById("new_email_err") as any).innerText = "This email is already in use."
                                        break;
                                        case "auth/requires-recent-login":
                                            (document.getElementById("new_email_err") as any).innerText = "Please login again, your credential is too old."
                                        break;
                                    }
                                })
                            }}>Submit</Button>
                        </Form>
                    })
                }}>Change Email</Button>
            </div>
        </>
    })
}
    return <Nav.Link onClick={display} style={{color: "white"}}>Settings</Nav.Link>
}

export default Auth