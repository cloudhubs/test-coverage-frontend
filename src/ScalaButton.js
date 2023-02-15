import axios from "axios"
import React, { useState, useEffect } from "react"
import { Button, Modal } from 'react-bootstrap'

const ScalaButton = () => {
    const [show, setShow] = useState(false)
    const [results, setResults] = useState('none')

    const handleClose = () => setShow(false)

    const handleShow = () => {
        //make axios request here
        /*
        var opt = {
            method: "GET",
            url:
              "localhost:8080"
        };
        axios.request(opt).then((res) => {
            setResults(res)
        })
        */
        setShow(true)
    }


    return (
        <>
            <Button variant="primary" onClick={handleShow}>Scala</Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title>Endpoints Tested</Modal.Title>
                </Modal.Header>
                <Modal.Body>{results}</Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={handleClose}>
                        Ok
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ScalaButton;
