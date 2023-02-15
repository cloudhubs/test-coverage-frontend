import { ChangeEvent, useState, useEffect } from 'react';
import axios from "axios"
import { Button, Modal } from 'react-bootstrap'

const FileUploadButton = () => {
    const [file, setFile] = useState();
    const [show, setShow] = useState(false)
    const [results, setResults] = useState('none')

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleUploadClick = () => {
        if (!file) {
            return;
        }
        
        sendFile()
        handleShow()
    };

    const handleClose = () => setShow(false)

    const handleShow = () => {
        

        setShow(true)
    }

    const sendFile = (file) => {
        //send file to backend to get the results
        axios.post("localhost:8080/selenium", file, {
            headers: {
                'content-type': file.type,
                'content-length': `${file.size}`,
              },
        }).then((res) => {
            setResults(res)
        }). catch((err) => console.error(err))
    }

    return (
        <div>
            <input type="file" onChange={handleFileChange} />

            <div>{file && `${file.name} - ${file.type}`}</div>

            <Button variant="primary" onClick={handleUploadClick}>Upload</Button>

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
        </div>
    );
}

export default FileUploadButton;
