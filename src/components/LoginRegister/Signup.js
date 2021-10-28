import React, { useRef, useState,useEffect } from "react"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { useAuth } from "../../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import { Container } from "react-bootstrap"
import { ref, child, get, set } from "firebase/database"
import shortid from "shortid"
import firebase from "../../sever/firebase"
import "bootstrap/dist/css/bootstrap.min.css";


export default function Signup() {

  const emailRef = useRef()
  const  userRef= useRef()
  const passwordRef = useRef()
  const passwordConfirmRef = useRef()
  const { signup, currentUser } = useAuth()
 
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const uid = shortid.generate();
  // const [validationMessage, validationMessage] = useState("")

  var format = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
  async function handleSubmit(e) {
    e.preventDefault()
    if( passwordRef.current.value.match(format) ){
      return setError("Password không chứa kí tự đặt biệt")
    }
    if( emailRef.current.value.match(format) ){
      return setError("email không chứa kí tự đặt biệt")
    }
    if( userRef.current.value.match(format) ){
      return setError("UserName không chứa kí tự đặt biệt")
    }
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords không trùng nhau")
    }
    if(passwordRef.current.value.length<6)
    {
       return setError("Passwords phải lớn hơn 6 kí tự") 
    }

    
    try {
      setError("")
      setLoading(true)
      const id = emailRef.current.value.replaceAll('.' , '_').replaceAll('@', '_');
      
        set(ref(firebase, `users/${id}`), {
        username: userRef.current.value,
        email: emailRef.current.value,
      });
       
      await signup(emailRef.current.value, passwordRef.current.value);

      history.push("/")
    } catch {
      setError("Failed to create an account")
    }

    setLoading(false)
    }

  return (
    <Container
    className="d-flex align-items-center justify-content-center"
    style={{ minHeight: "100vh" }}
  >
        <div className="w-100" style={{ maxWidth: "400px" }}>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Sign Up</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
          <Form.Group id="username">
              <Form.Label>UserName</Form.Label>
              <Form.Control type="text" ref={userRef} required />
            </Form.Group>
            {/* <div className="text-center mb-4">{validationMessage}</div> */}
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" ref={passwordRef} required />
            </Form.Group>
            <Form.Group id="password-confirm">
              <Form.Label>Password Confirmation</Form.Label>
              <Form.Control type="password" ref={passwordConfirmRef} required />
            </Form.Group>
           <br />
            <Button disabled={loading} className="w-100" type="submit">
              Sign Up
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        Already have an account? <Link to="/login">Log In</Link>
      </div>
      </div>
      </Container>
  )
}
