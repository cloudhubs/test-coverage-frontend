import { ChangeEvent, useState } from 'react';
import axios from "axios"
import { Button, Modal } from 'react-bootstrap'

const FileUploadButton = (props) => {
    const theme = props.theme
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

    const sendFile = () => {
        //send file to backend to get the results
        const formData = new FormData();
        formData.append('file', file);

        axios.post("http://localhost:8080/tests/selenium/getAll", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
              },
        }).then((res) => {
            console.log(res.data)
            setResults(res.data)
        }).catch((err) => console.error(err))
    }

    return (
        <div>
            <input type="file" onChange={handleFileChange} />

            <div>{file && `${file.name} - ${file.type}`}</div>

            <Button variant={theme === 'light' ? "primary" : "dark"} onClick={handleUploadClick}>Upload</Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title>Endpoints Tested</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div style={{ whiteSpace: 'pre'}}>
                    {results}
                  </div>
                </Modal.Body>
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
